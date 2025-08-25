"use client";

import ReactECharts from 'echarts-for-react';

interface FFTDataPoint {
  frequency: number;
  amplitude: number;
}

interface FFTChartProps {
  data?: FFTDataPoint[];
  height?: string;
  width?: string;
}

  // Generate sample FFT data for demonstration
  function generateSampleFFTData(): FFTDataPoint[] {
    const points: FFTDataPoint[] = [];
    
      for (let i = 0; i <= 1000; i += 2) {
      const frequency = i;
      let amplitude = 0;
      
      // Create a complex waveform with multiple harmonics and noise
      if (frequency < 100) {
        // Low frequency noise
        amplitude = Math.random() * 0.3 + 0.1;
      } else if (frequency >= 100 && frequency < 300) {
        // Main harmonic region
        amplitude = Math.sin(frequency * 0.1) * 0.8 + 
                   Math.sin(frequency * 0.05) * 0.6 +
                   Math.random() * 0.2;
      } else if (frequency >= 300 && frequency < 600) {
        // Secondary harmonics
        amplitude = Math.sin(frequency * 0.08) * 0.4 +
                   Math.sin(frequency * 0.12) * 0.3 +
                   Math.random() * 0.15;
      } else {
        // High frequency components
        amplitude = Math.sin(frequency * 0.15) * 0.2 +
                   Math.random() * 0.1;
      }
      
      // Ensure amplitude is positive and add some spiky characteristics
      amplitude = Math.abs(amplitude) + (Math.random() > 0.95 ? Math.random() * 0.5 : 0);
      
      points.push({ frequency, amplitude });
    }
    
    return points;
  }

  export default function FFTSeriesChart({ 
    data, 
    height = '400px', 
    width = '100%' 
  }: FFTChartProps) {
    
    // Use provided data or generate sample data
    const chartData = data || generateSampleFFTData();

  const option = {
    title: {
      text: 'FFT Series',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 18,
        fontWeight: 500,
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params: Array<{value: [number, number]}>) {
        const data = params[0];
        return `Frequency: ${data.value[0].toFixed(1)} Hz<br/>Amplitude: ${data.value[1].toFixed(3)}`;
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e0e0',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      top: '15%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: 'Frequency (Hz)',
      nameLocation: 'middle',
      nameGap: 40,
      nameTextStyle: {
        fontSize: 12,
        color: '#666'
      },
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisTick: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisLabel: {
        color: '#666',
        fontSize: 11
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      name: 'Amplitude',
      nameLocation: 'middle',
      nameGap: 50,
      nameTextStyle: {
        fontSize: 12,
        color: '#666'
      },
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisTick: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisLabel: {
        color: '#666',
        fontSize: 11
      },
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: 'FFT Amplitude',
        type: 'line',
        data: chartData.map(point => [point.frequency, point.amplitude]),
        smooth: false,
        lineStyle: {
          color: '#2c3e50',
          width: 1.5
        },
        symbol: 'none',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(44, 62, 80, 0.1)'
              },
              {
                offset: 1,
                color: 'rgba(44, 62, 80, 0.01)'
              }
            ]
          }
        },
        emphasis: {
          lineStyle: {
            width: 2,
            color: '#34495e'
          }
        }
      }
    ]
  };

    return (
      <div className="fft-chart-container">
        <ReactECharts 
          option={option} 
          style={{ height, width }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    );
  }
