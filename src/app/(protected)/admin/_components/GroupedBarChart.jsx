"use client";
import Chart from 'react-apexcharts';

const GroupedBarChart = () => {
  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false, // Hide toolbar
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '80%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'], // Make bars distinct
    },
    xaxis: {
      categories: ['Oct 1', 'Oct 2', 'Oct 3', 'Oct 4', 'Oct 5', 'Oct 6', 'Oct 7', 'Oct 8', 'Oct 9', 'Oct 10',  'Oct 11', ], // Example categories
    },
    yaxis: {
      title: {
        text: '',
      },
      
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Remove X-axis grid lines
        },
      },
      yaxis: {
        lines: {
          show: false, // Show Y-axis grid lines
          lineWidth: 1,
          dashArray: 4, // Make Y-axis grid lines dotted
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}`, // Tooltip formatting
      },
    },
    legend: {
      show: false,
      position: 'top',
      horizontalAlign: 'center',
    },
    colors: ['#1E3A8A', '#0EA5E9', '#F59E0B'], // Tailwind colors
  };

  const chartSeries = [
    {
      name: 'Product A',
      data: [50, 70, 68, 100, 200, 300, 150, 250, 49, 60, 45 ],
    },
    {
      name: 'Product B',
      data: [100, 230, 220, 80, 130, 50, 60, 200, 78, 100, 120],
    },
    {
      name: 'Product C',
      data: [70, 170, 15, 105, 201, 90, 300, 270, 200, 80, 70],
    },
    {
      name: 'Product C',
      data: [140, 60, 15, 150, 201, 40, 60, 50, 300, 208, 100],
    },
    {
      name: 'Product C',
      data: [30, 170, 15, 105, 201, 40, 60, 50, 300, 208, 100],
    },
    {
      name: 'Product C',
      data: [200, 270, 15, 105, 201, 40, 60, 50, 300, 208, 100],
    },
    {
      name: 'Product C',
      data: [150, 120, 15, 105, 201, 40, 60, 50, 300, 208, 100],
    },
    {
      name: 'Product C',
      data: [300, 170, 15, 105, 201, 40, 60, 50, 300, 208, 100],
    },
    {
      name: 'Product C',
      data: [254, 230, 15, 105, 201, 40, 60, 50, 300, 208, 100],
    },
    {
      name: 'Product C',
      data: [200, 290, 15, 105, 201, 40, 60, 50, 300, 208, 100],
    },
  ];

  return (
    <div className="md:p-4 bg-white rounded-lg shadow-xs border-2">
      <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
    </div>
  );
};

export default GroupedBarChart;
