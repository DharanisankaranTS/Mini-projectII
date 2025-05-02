import React, { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Chart from "chart.js/auto";

interface ChartCardProps {
  title: string;
  buttonText?: string;
  onButtonClick?: () => void;
  chartType: "bar" | "line" | "pie" | "doughnut";
  chartData: {
    labels: string[];
    datasets: {
      label?: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  };
  chartOptions?: any;
}

export function ChartCard({
  title,
  buttonText,
  onButtonClick,
  chartType,
  chartData,
  chartOptions = {}
}: ChartCardProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: chartType,
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            ...chartOptions
          }
        });
      }
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartType, chartData, chartOptions]);

  return (
    <Card className="shadow-sm border border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-slate-900">{title}</h3>
          {buttonText && (
            <div>
              <Button
                onClick={onButtonClick}
                variant="outline"
                size="sm"
              >
                {buttonText}
              </Button>
            </div>
          )}
        </div>
        <div className="h-80 relative">
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  );
}

export default ChartCard;
