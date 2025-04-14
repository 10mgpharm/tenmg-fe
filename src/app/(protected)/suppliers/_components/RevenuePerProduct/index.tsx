import ChartComponent from "@/app/(protected)/vendors/_components/ChartComponent";
import { ApexOptions } from "apexcharts";
import React from "react";

const RevenuePerProduct = ({data, loading}: any) => {

  const categories = data?.map((product: any) => product.name);
  const revenues = data?.map((product: any) => parseFloat(product.revenue));

  const formatValue = (value: any) => {
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `₦${(value / 1000).toFixed(1)}K`;
    } else {
      return `₦${value.toFixed(1)}`;
    }
  };

  const chartOptions: ApexOptions = {
    chart: {
      type: 'line',
      stacked: false,
    },
    stroke: {
      width: [0, 0, 2], // Bars have 0 stroke, line has width 2
      curve: 'smooth',
    },
    plotOptions: {
      bar: {
        columnWidth: '50%', // Adjust bar width
        dataLabels: {
          position: "top"
        }
      },
    },
    colors: ['#5A67D8', '#68D391', '#ED8936'], // Colors: blue, green, orange
    dataLabels: {
      enabled: true,
      textAnchor: "middle",
      enabledOnSeries: [0, 1], // Show labels only on bar series
      style: {
        fontSize: '12px',
        colors: ['#000'],
      },
    },
    xaxis: {
      categories
    },
    yaxis: [
      {
        // title: {
        //   text: 'Values',
        // },
        labels: {
          formatter: formatValue,
        },
      },
      {
        opposite: true,
        // title: {
        //   text: 'Line Indicator',
        // },
        max: 100,
      },
    ],
    legend: {
      position: 'bottom',
    },
  };    

  const series = [
    {
      name: "Revenue",
      data: revenues,
    },
  ];

    
  return (
    <div className="bg-white p-5 rounded-md">
        <h3 className="text-gray-600 font-semibold text-lg">Revenue Per Product</h3>
        <React.Fragment>
          <div className="">
              {loading ? (
              <div className="flex items-center justify-center h-80 text-gray-500">
                Loading chart...
              </div>
              ) : (
                <ChartComponent
                options={chartOptions}
                series={series}
                type="bar"
                width={"100%"}
                height={320}
                />
              )}
          </div>
        </React.Fragment>
    </div>
  )
}

export default RevenuePerProduct