import Link from 'next/link';
import FFTSeriesChart from '../../../components/FFTSeriesChart';

interface TimeSeriesData {
  ts: number;
  rpm: number;
  rawData: number[];
}

async function getSensorData(id: string): Promise<TimeSeriesData[]> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/bearing/${id}/data`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return [];
  }
}

type PageProps = {
  params: { sensorId: string }
}

export default async function SensorDetailsPage({ params }: PageProps) {
  const sensorData = await getSensorData(params.sensorId);

  return (
    <main className="details-main">
      <Link href="/" className="back-link">← Back to Dashboard</Link>
      <header className="details-header">
        <h1>Sensor Analysis</h1>
        <p>Sensor ID: {params.sensorId}</p>
        <Link href="/" className="back-to-dashboard">← Back to Dashboard</Link>
      </header>

      <section className="data-analysis">
        <h2>FFT Analysis</h2>
        {sensorData.length > 0 ? (
          <div className="fft-analysis-container">
            <FFTSeriesChart 
              data={sensorData.flatMap(dataPoint => 
                dataPoint.rawData ? dataPoint.rawData.map((amplitude, index) => ({
                  frequency: index * 10, // Convert index to frequency (Hz)
                  amplitude: amplitude
                })) : []
              )}
              height="500px"
            />
            <div className="data-summary">
              <h3>Data Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span>Total Data Points:</span>
                  <strong>{sensorData.reduce((total, dp) => total + (dp.rawData?.length || 0), 0)}</strong>
                </div>
                <div className="summary-item">
                  <span>Time Range:</span>
                  <strong>
                    {sensorData.length > 0 ? 
                      `${new Date(sensorData[0].ts * 1000).toLocaleString()} - ${new Date(sensorData[sensorData.length - 1].ts * 1000).toLocaleString()}`
                      : 'N/A'
                    }
                  </strong>
                </div>
                <div className="summary-item">
                  <span>Average RPM:</span>
                  <strong>
                    {sensorData.length > 0 ? 
                      Math.round(sensorData.reduce((sum, dp) => sum + dp.rpm, 0) / sensorData.length)
                      : 'N/A'
                    }
                  </strong>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>No detailed data available for this sensor.</p>
        )}
      </section>
    </main>
  );
}
