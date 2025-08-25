import Link from 'next/link';

// Define the data structures for a single machine and its bearings
interface Bearing {
  _id: string;
  bearingLocationType: string;
  statusname: string;
  name?: string; // Add optional name field
  location?: string; // Add optional location field
}

interface MachineDetails {
  _id: string;
  name: string;
  statusName: string;
  machineType: string;
  dataUpdatedTime: string;
  bearings: Bearing[];
}

// This function fetches data for one specific machine
async function getMachineDetails(id: string): Promise<MachineDetails | null> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/machine/${id}`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching machine details:", error);
    return null;
  }
}

// The props for this page include the dynamic 'machineId' from the URL
type PageProps = {
  params: { machineId: string }
}

export default async function MachineDetailsPage({ params }: PageProps) {
  const machine = await getMachineDetails(params.machineId);

  if (!machine) {
    return (
      <main className="details-main">
        <Link href="/" className="back-link">← Back to Dashboard</Link>
        <div className="error-message">
          <p>Could not load machine data. Please check if the machine ID is correct.</p>
          <Link href="/" className="nav-link">Return to Dashboard</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="details-main">
      <Link href="/" className="back-link">← Back to Dashboard</Link>
      <header className="details-header">
        <h1>{machine.name}</h1>
        <span className={`status-${machine.statusName?.toLowerCase()}`}>{machine.statusName}</span>
      </header>

      <section className="details-grid">
        <div className="detail-item">
          <span>Machine ID</span>
          <strong>{machine._id}</strong>
        </div>
        <div className="detail-item">
          <span>Machine Type</span>
          <strong>{machine.machineType}</strong>
        </div>
        <div className="detail-item">
          <span>Last Update</span>
          <strong>{new Date(machine.dataUpdatedTime).toLocaleString()}</strong>
        </div>
      </section>

      <section className="bearings-list">
        <h2>Sensors / Bearings</h2>
        {machine.bearings && machine.bearings.length > 0 ? (
          <ul>
            {machine.bearings.map((bearing) => (
              <Link key={bearing._id} href={`/sensor/${bearing._id}`} className="bearing-link">
                <li>
                  <div className="bearing-info">
                    <span className="bearing-name">
                      {bearing.name || bearing.bearingLocationType || `Sensor ${bearing._id.slice(-4)}`}
                    </span>
                    <span className="bearing-location">
                      {bearing.location || bearing.bearingLocationType || 'Location Unknown'}
                    </span>
                  </div>
                  <span className={`status-${bearing.statusname?.toLowerCase()}`}>{bearing.statusname}</span>
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          <p>No bearing data available for this machine.</p>
        )}
      </section>
    </main>
  );
}