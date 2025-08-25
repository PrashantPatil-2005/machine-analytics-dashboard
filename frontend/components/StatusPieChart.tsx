"use client";

import ReactECharts from 'echarts-for-react';

interface ChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

export default function StatusPieChart({ data }: ChartProps) {
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center'
    },
    series: [
      {
        name: 'Machine Status',
        type: 'pie',
        radius: '70%',
        center: ['65%', '50%'],
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />;
}