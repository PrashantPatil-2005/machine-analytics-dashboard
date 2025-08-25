# Machine Analytics Dashboard

A multi-page web application for monitoring and analyzing machine performance data with real-time status tracking and sensor analysis.

## Features

- **Dashboard**: Overview with KPI cards, search/filter controls, and machine status pie chart
- **Machine Details**: Individual machine information with sensor/bearing listings
- **Sensor Analysis**: Time-series data visualization for individual sensors

## Technology Stack

- **Frontend**: Next.js 15 with React 19, TypeScript, and ECharts
- **Backend**: Python FastAPI with Supabase integration
- **Database**: Supabase (PostgreSQL)
- **Styling**: Custom CSS with responsive design

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Supabase account and project

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd machine-analytics-dashboard

# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```bash
# Backend/.env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

### 3. Database Setup

Ensure your Supabase project has the following tables:

- `machine`: Contains machine information (id, name, status, type, etc.)
- `bearing`: Contains sensor/bearing information (id, machineid, location, status, etc.)
- `data`: Contains time-series sensor data (bearing_id, ts, rpm, rawData, etc.)

### 4. Start the Application

```bash
# Terminal 1: Start Backend
cd backend
uvicorn main:app --reload --host 127.0.0.1 --port 8000

# Terminal 2: Start Frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://127.0.0.1:8000

## Troubleshooting

### Common Issues

1. **"Module not found" errors**: Ensure all dependencies are installed
2. **CORS errors**: Backend CORS middleware is configured for localhost:3000
3. **Database connection errors**: Verify Supabase credentials in .env file
4. **Chart not rendering**: Check if echarts dependencies are installed

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify backend API endpoints are responding
3. Confirm database tables exist and contain data
4. Check network tab for failed API requests

## API Endpoints

- `GET /api/machines` - List all machines
- `GET /api/machine/{id}` - Get machine details with bearings
- `GET /api/bearing/{id}/data` - Get sensor time-series data

## Project Structure

```
machine-analytics-dashboard/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── .env                # Environment variables
├── frontend/
│   ├── app/
│   │   ├── page.tsx        # Dashboard page
│   │   ├── machine/[id]/   # Machine details page
│   │   ├── sensor/[id]/    # Sensor analysis page
│   │   └── globals.css     # Global styles
│   ├── components/          # Reusable components
│   └── package.json        # Node dependencies
└── README.md
```

## Next Steps

After getting the application stable:

1. **Add Authentication**: Implement user login/registration
2. **Real-time Updates**: Add WebSocket support for live data
3. **Advanced Charts**: Implement more sophisticated data visualizations
4. **Data Export**: Add CSV/PDF export functionality
5. **Mobile Responsiveness**: Optimize for mobile devices
6. **Testing**: Add unit and integration tests
7. **Deployment**: Deploy to production environment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Your License Here]
