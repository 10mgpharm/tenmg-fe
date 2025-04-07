import ChartComponent from "@/app/(protected)/vendors/_components/ChartComponent";
import { ApexOptions } from "apexcharts";
import React from "react";

const RevenuePerProduct = ({data, loading}: any) => {

  const categories = data?.map((product: any) => product.name);
  const revenues = data?.map((product: any) => parseFloat(product.revenue));

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
    // labels: [
    //   'Product 1',
    //   'Product 2',
    //   'Product 3',
    //   'Product 4',
    //   'Product 5',
    //   'Product 6',
    //   'Product 7',
    //   'Product 8',
    //   'Product 9',
    //   'Product 10',
    //   'Product 11',
    //   'Product 12',
    // ],
    xaxis: {
      categories
    },
    yaxis: [
      {
        // title: {
        //   text: 'Values',
        // },
        labels: {
          formatter: (val: number) => val.toFixed(0),
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

  // const series = [
  //   {
  //     name: 'Indicator', // Blue bars
  //     type: 'column',
  //     data: [69, 42, 32, 20, 41, 11, 57, 15, 57, 94, 92, 42],
  //   },
  //   // {
  //   //   name: 'Indicator', // Green bars
  //   //   type: 'column',
  //   //   data: [42, 50, 35, 82, 15, 15, 53, 36, 94, 52, 54, 15],
  //   // },
  //   // {
  //   //   name: 'Indicator', // Orange line
  //   //   type: 'line',
  //   //   data: [80, 60, 55, 70, 75, 80, 95, 70, 75, 85, 92, 68],
  //   // },
  // ];
    
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