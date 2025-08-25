import os
from fastapi import FastAPI, HTTPException
from supabase import create_client, Client
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware # <--- ADD THIS LINE

# Load environment variables from a .env file
load_dotenv()

# --- Supabase Setup ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL and Key must be set in the .env file")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- FastAPI App ---
app = FastAPI()

# --- ADD THESE LINES TO FIX THE ERROR ---
origins = [
    "http://localhost:3000", # The address of your frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# -----------------------------------------


# --- API Endpoints ---

@app.get("/")
def health_check():
    """
    Health check endpoint to verify the API is running.
    """
    return {"status": "healthy", "message": "Machine Analytics API is running"}

@app.get("/api/machines")
def get_all_machines():
    """
    Gets all machine data for the main dashboard list.
    """
    try:
        response = supabase.table("machine").select("*").order("name").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/machine/{machine_id}")
def get_machine_details(machine_id: str):
    """
    Gets details for one specific machine, including its bearings.
    """
    try:
        machine_response = supabase.table("machine").select("*").eq("_id", machine_id).single().execute()
        
        if not machine_response.data:
            raise HTTPException(status_code=404, detail="Machine not found")

        # Get bearings with enhanced information
        bearing_response = supabase.table("bearing").select("*").eq("machineid", machine_id).execute()
        
        # Process bearings to add better names and locations
        bearings = bearing_response.data
        for bearing in bearings:
            # Generate a human-readable name if not available
            if not bearing.get('name'):
                bearing['name'] = f"Sensor {bearing.get('bearingLocationType', 'Unknown')}"
            
            # Generate location information if not available
            if not bearing.get('location'):
                bearing['location'] = bearing.get('bearingLocationType', 'Location Unknown')

        machine_details = machine_response.data
        machine_details["bearings"] = bearings
        
        return machine_details
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/bearing/{bearing_id}/data")
def get_bearing_data(bearing_id: str):
    """
    Gets time-series data for a specific bearing/sensor.
    """
    try:
        # Validate bearing_id
        if not bearing_id or len(bearing_id.strip()) == 0:
            raise HTTPException(status_code=400, detail="Invalid bearing ID")
        
        response = supabase.table("data").select("*").eq("bearing_id", bearing_id).order("ts").execute()
        
        if not response.data:
            return []
        
        # Validate and clean data
        cleaned_data = []
        for item in response.data:
            if item.get('ts') and item.get('rawData'):
                # Ensure rawData is a list of numbers
                if isinstance(item['rawData'], list):
                    item['rawData'] = [float(x) if isinstance(x, (int, float)) else 0.0 for x in item['rawData']]
                else:
                    item['rawData'] = []
                
                # Ensure RPM is a number
                if item.get('rpm'):
                    item['rpm'] = float(item['rpm']) if isinstance(item['rpm'], (int, float)) else 0.0
                else:
                    item['rpm'] = 0.0
                
                cleaned_data.append(item)
        
        return cleaned_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch bearing data: {str(e)}")