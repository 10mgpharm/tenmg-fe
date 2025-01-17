import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const DonutChart = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024); // Adjust screen width breakpoint as needed
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check on mount

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chartOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['Suppliers', 'Pharmacies', 'Vendors', 'Lenders'],
    colors: ['#2196F3', '#4CAF50', '#FF9800', '#FF5722'],
    legend: {
      show: true,
      position: isSmallScreen ? 'bottom' : 'right', // Conditionally set legend position
      fontSize: '14px',
      labels: {
        colors: '#000', // Black text for legend
      },
      markers: {
        width: 12,
        height: 12,
        radius: 12, // Make legend markers circular
      },
      formatter: (seriesName, opts) => {
        const value = opts.w.globals.series[opts.seriesIndex];
        return `
          <div class="flex flex-col py-3 px-2">
            <p class="text-sm font-semibold">${seriesName}</p>
            <span class="text-sm text-gray-600">${value}</span>
          </div>
        `;
      },
    },
    dataLabels: {
      enabled: false,
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => `${val}`, // Tooltip shows raw value
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '80%', // Create the donut shape
          labels: {
            show: true,
            total: {
              show: true,
              label: ' 50, 25, 15, 10, Ratio',
              formatter: () => ``, // Leave the total text empty
            },
          },
        },
      },
    },
    stroke: {
      width: 0,
    },
  };

  const chartSeries = [50, 25, 15, 10];

  return (
    <div className="bg-white">
        <div className="flex items-center justify-between rounded-tr-lg rounded-tl-lg border p-5">
          <p className="font-semibold text-base text-gray-600 md:text-lg">User Relationship</p>
          <p className='text-primary-500 text-sm md:text-base font-medium'>View all</p>
        </div>
        <div className="rounded-br-lg rounded-bl-lg border-b border-x p-5 h-[450px] sm:h-[250px] md:h-[350px]">
          <Chart options={chartOptions} series={chartSeries} type="donut" height="100%" />
        </div>
    </div>
  );
};

export default DonutChart;
