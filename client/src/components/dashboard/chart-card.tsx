import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

type ChartCardProps = {
  title: string;
  type: "bar" | "doughnut";
  filter: string;
  data: any | null;
};

export default function ChartCard({ title, type, filter, data }: ChartCardProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const colors = [
      'rgba(37, 99, 235, 0.7)',    // blue
      'rgba(8, 145, 178, 0.7)',    // cyan
      'rgba(79, 70, 229, 0.7)',    // indigo
      'rgba(16, 185, 129, 0.7)',   // green
      'rgba(245, 158, 11, 0.7)',   // yellow
      'rgba(236, 72, 153, 0.7)'    // pink
    ];

    let chartConfig;

    if (type === "bar") {
      // Default dummy data for organ type distribution
      const defaultData = {
        labels: ['Kidney', 'Liver', 'Heart', 'Lung', 'Cornea', 'Pancreas'],
        values: [423, 318, 156, 98, 211, 78]
      };

      // Use provided data or default
      const chartData = data || defaultData;
      
      // Ensure labels array exists and has length
      const validLabels = chartData?.labels || [];
      const validValues = chartData?.values || [];
      
      chartConfig = {
        type: 'bar' as const,
        data: {
          labels: validLabels,
          datasets: [{
            label: 'Donations',
            data: validValues,
            backgroundColor: colors
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(226, 232, 240, 0.5)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      };
    } else if (type === "doughnut") {
      // Default dummy data for regional distribution
      const defaultData = {
        labels: ['North', 'South', 'East', 'West', 'Central'],
        values: [35, 20, 15, 18, 12]
      };

      // Use provided data or default
      const chartData = data || defaultData;
      
      // Ensure labels array exists and has length
      const validLabels = chartData?.labels || [];
      const validValues = chartData?.values || [];
      
      chartConfig = {
        type: 'doughnut' as const,
        data: {
          labels: validLabels,
          datasets: [{
            data: validValues,
            backgroundColor: colors.slice(0, validLabels.length),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 15,
                padding: 15
              }
            }
          }
        }
      };
    }

    if (chartConfig) {
      chartInstance.current = new Chart(ctx, chartConfig);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-slate-900">{title}</h3>
        <div>
          <button type="button" className="inline-flex items-center px-2.5 py-1.5 border border-slate-300 text-xs font-medium rounded text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            {filter}
          </button>
        </div>
      </div>
      <div className="h-80 relative">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
