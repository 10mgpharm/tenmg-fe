// ChartComponent.tsx
"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamically import the Chart component with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartComponentProps {
  options: ApexOptions;
  series: number[] | Array<{ name: string; data: number[] }>;
  type:
    | "line"
    | "area"
    | "bar"
    | "pie"
    | "donut"
    | "radar"
    | "scatter"
    | "bubble"
    | "heatmap"
    | "candlestick"
    | "radialBar";
  width?: number | string;
  height?: number | string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  options,
  series,
  type,
  width,
  height,
}) => {
  return (
    <div>
      <Chart
        options={options}
        series={series}
        type={type}
        width={width}
        height={height}
      />
    </div>
  );
};

export default ChartComponent;
