import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface CardStatProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  bgColor?: string;
  iconColor?: string;
}

export function CardStat({
  title,
  value,
  icon,
  trend,
  bgColor = "bg-primary-100",
  iconColor = "text-primary-600"
}: CardStatProps) {
  return (
    <Card className="shadow-sm border border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${bgColor}`}>
            <div className={`h-6 w-6 ${iconColor}`}>{icon}</div>
          </div>
          <div className="ml-5">
            <dl>
              <dt className="text-sm font-medium text-slate-500 truncate">{title}</dt>
              <dd className="mt-1 text-3xl font-semibold text-slate-900">{value}</dd>
            </dl>
          </div>
        </div>
        {trend && (
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <span 
                className={`text-xs font-medium flex items-center ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                <svg
                  className="mr-1 h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      trend.isPositive
                        ? "M5 10l7-7m0 0l7 7m-7-7v18"
                        : "M19 14l-7 7m0 0l-7-7m7 7V3"
                    }
                  />
                </svg>
                {trend.value}
              </span>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CardStat;
