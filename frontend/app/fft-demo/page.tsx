import Link from 'next/link';
import FFTSeriesChart from '../../components/FFTSeriesChart';

export default function FFTSeriesDemoPage() {
  return (
    <main className="details-main">
      <Link href="/" className="back-link">← Back to Dashboard</Link>
      
      <header className="details-header">
        <h1>FFT Series Chart Demo</h1>
        <p>Fast Fourier Transform analysis visualization for machine vibration data</p>
      </header>

      <section className="demo-section">
        <h2>Default FFT Chart</h2>
        <p>This chart shows a typical FFT analysis with complex harmonics and noise patterns commonly found in machine vibration data.</p>
        <FFTSeriesChart height="500px" />
      </section>

      <section className="demo-section">
        <h2>Custom Size Chart</h2>
        <p>A smaller version of the chart for dashboard integration.</p>
        <FFTSeriesChart height="300px" width="80%" />
      </section>

      <section className="demo-section">
        <h2>Chart Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>Clean Design</h3>
            <p>Minimalist white background with no grid lines for a modern analytics look</p>
          </div>
          <div className="feature-item">
            <h3>Interactive Tooltips</h3>
            <p>Hover over the chart to see exact frequency and amplitude values</p>
          </div>
          <div className="feature-item">
            <h3>Realistic Data</h3>
            <p>Complex waveform with harmonics, noise, and spiky characteristics</p>
          </div>
          <div className="feature-item">
            <h3>Responsive</h3>
            <p>Customizable height and width for different dashboard layouts</p>
          </div>
        </div>
      </section>
    </main>
  );
}
