"use client";

import ReactECharts from "echarts-for-react";

interface ChartProps {
  data: { name: string; value: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  Normal: "#22c55e",   // green
  Alert: "#f59e0b",    // amber
  Critical: "#ef4444", // red
  Unknown: "#94a3b8"   // gray fallback
};

export default function StatusPieChart({ data }: ChartProps) {
  // Map data to always use fixed colors per status
  const seriesData = data.map((d) => ({
    ...d,
    itemStyle: { color: STATUS_COLORS[d.name] ?? STATUS_COLORS.Unknown }
  }));

  const option = {
    tooltip: {
      trigger: "item",
      formatter: (p: any) => `${p.name}: ${p.value} (${p.percent}%)`
    },
    legend: {
      orient: "vertical",
      left: "left",
      top: "center"
    },
    series: [
      {
        name: "Machine Status",
        type: "pie",
        radius: ["50%", "70%"], // donut; change to "70%" for solid pie
        center: ["65%", "50%"], // push right to make space for legend
        data: seriesData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        },
        label: {
          show: true,
          formatter: "{b}: {d}%" // e.g. Normal: 60%
        }
      }
    ]
  };

  return (
    <ReactECharts option={option} style={{ height: "400px", width: "100%" }} />
  );
}
