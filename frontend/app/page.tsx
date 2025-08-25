"use client"; 

import { useState, useEffect } from 'react';
import Link from 'next/link';
import KpiCard from '../components/KpiCard';
import StatusPieChart from '../components/StatusPieChart';

interface Machine {
  _id: string;
  name: string;
  statusName: string;
}

export default function HomePage() {
  const [allMachines, setAllMachines] = useState<Machine[]>([]);
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getMachines() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch('http://127.0.0.1:8000/api/machines', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('Failed to fetch machine data');
        }
        const data: Machine[] = await res.json();
        setAllMachines(data);
        setFilteredMachines(data);
      } catch (error) {
        console.error('Error fetching machines:', error);
        setError('Failed to load machine data. Please check if the backend is running.');
      } finally {
        setIsLoading(false);
      }
    }
    getMachines();
  }, []);

  useEffect(() => {
    let machines = allMachines;
    if (statusFilter !== 'All') {
      machines = machines.filter(m => m.statusName === statusFilter);
    }
    if (searchQuery) {
      machines = machines.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredMachines(machines);
  }, [searchQuery, statusFilter, allMachines]);

  // Calculate KPI values
  const totalMachines = allMachines.length;
  const alertMachines = allMachines.filter(m => m.statusName === 'Alert').length;
  const criticalMachines = allMachines.filter(m => m.statusName === 'Critical').length;
  const normalMachines = allMachines.filter(m => m.statusName === 'Normal').length;

  // Prepare data for the pie chart
  const pieChartData = [
    { value: normalMachines, name: 'Normal' },
    { value: alertMachines, name: 'Alert' },
    { value: criticalMachines, name: 'Critical' },
  ];

  return (
    <main>
      <header>
        <h1>Machine Analytics Dashboard</h1>
        <nav className="dashboard-nav">
          <Link href="/fft-demo" className="nav-link">FFT Chart Demo</Link>
        </nav>
      </header>
      
      <section className="kpi-grid">
        <KpiCard title="Total Machines" value={totalMachines} />
        <KpiCard title="Alert Machines" value={alertMachines} />
        <KpiCard title="Critical Machines" value={criticalMachines} />
      </section>

      <section className="controls">
        <input 
          type="text" 
          placeholder="Search machines..." 
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="filter-buttons">
          <button onClick={() => setStatusFilter('All')} className={statusFilter === 'All' ? 'active' : ''}>All</button>
          <button onClick={() => setStatusFilter('Normal')} className={statusFilter === 'Normal' ? 'active' : ''}>Normal</button>
          <button onClick={() => setStatusFilter('Alert')} className={statusFilter === 'Alert' ? 'active' : ''}>Alert</button>
          <button onClick={() => setStatusFilter('Critical')} className={statusFilter === 'Critical' ? 'active' : ''}>Critical</button>
        </div>
      </section>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {isLoading ? (
        <div className="loading">
          <p>Loading machine data...</p>
        </div>
      ) : (
        <section className="dashboard-body">
          <div className="chart-container">
            <h2>Machine Status</h2>
            <StatusPieChart data={pieChartData} />
          </div>
          <div className="list-container">
            <h2>Machine List</h2>
            {filteredMachines.length > 0 ? (
              <ul>
                {filteredMachines.map((machine) => (
                  <li key={machine._id}>
                    <Link href={`/machine/${machine._id}`} className="machine-link">
                      <span>{machine.name}</span>
                      <span className={`status-${machine.statusName?.toLowerCase()}`}>
                        {machine.statusName}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No machines match the current filter.</p>
            )}
          </div>
        </section>
      )}
    </main>
  );
}