"use client";
import { ApexOptions } from "apexcharts";
import ChartComponent from '../../vendors/_components/ChartComponent';

const user = [
  { id: 1, name: "Fubura Dickson", pharmacyName: "Vendor's pharmacy name", amount: "₦300,0000", creditScore: "75%" },
  { id: 2, name: "Fubura Dickson", pharmacyName: "Vendor's pharmacy name", amount: "₦300,0000", creditScore: "15%" },
  { id: 3, name: "Fubura Dickson", pharmacyName: "Vendor's pharmacy name", amount: "₦300,0000", creditScore: "45%" },
  { id: 4, name: "Fubura Dickson", pharmacyName: "Vendor's pharmacy name", amount: "₦300,0000", creditScore: "45%" },
  { id: 5, name: "Fubura Dickson", pharmacyName: "Vendor's pharmacy name", amount: "₦300,0000", creditScore: "45%" },
]

const ActivityCharts = ({ data }: any) => {

  const chartOptions: ApexOptions = {
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
        // endingShape: 'rounded',
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
      categories: ['Oct 1', 'Oct 2', 'Oct 3', 'Oct 4', 'Oct 5', 'Oct 6', 'Oct 7', 'Oct 8', 'Oct 9', 'Oct 10', 'Oct 11',], // Example categories
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
          // lineWidth: 1,
          // dashArray: 4, // Make Y-axis grid lines dotted
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
      data: [50, 70, 68, 100, 200, 300, 150, 250, 49, 60, 45],
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

  const pieOptions: ApexOptions = {
    chart: {
      type: "donut",
      toolbar: {
        show: false,
      },
    },
    colors: ['#2196F3', '#4CAF50', '#FF9800', '#FF5722'],
    labels: ['Suppliers', 'Customers', 'Vendors', 'Lenders'],
    legend: {
      position: "right",
      fontSize: "14px",
      labels: {
        colors: '#000',
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
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    plotOptions: {
      pie: {
        donut: {
          size: '80%',
          labels: {
            show: true,
            total: {
              show: true,
              // label: '50%, 25%, 15%, 10%',
              formatter: (total) => `Ratio`,
              color: '#333',
              fontSize: '14px',
              fontFamily: 'Arial, sans-serif',
            },
          },
        },
      },
    },
  };

  const pieSeries = [data?.users?.supplier, data?.users?.customer, data?.users?.vendor, data?.users?.lender];

  return (
    <div className=''>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
        <div className="col-span-6 md:col-span-4 bg-white py-5 px-3 rounded-md">
          <ChartComponent
            options={chartOptions}
            series={chartSeries}
            type="bar"
            width={"100%"}
            height={350}
          />
        </div>
        <div className="col-span-6 md:col-span-2">
          <div className="bg-primary-500 flex items-center flex-col justify-center h-full w-full rounded-lg text-white py-20 md:py-0">
            <h3 className="text-2xl font-semibold">
              Store Visitors
            </h3>
            <select className="bg-primary-300 rounded-full px-3 outline-none ring-0 py-1 mt-4">
              <option value="active">Today</option>
              <option value="paused">1 week</option>
              <option value="delayed">1 Month</option>
              <option value="canceled">All Time</option>
            </select>
            <h1 className="text-6xl font-bold mt-6">
              102.5k
            </h1>
          </div>
        </div>
        <div className="col-span-6 md:col-span-3 bg-white border rounded-lg">
          <div className="flex items-center justify-between p-5 border-b">
            <p className="font-semibold text-base text-gray-600 md:text-lg">User Relationship</p>
            <p className='text-primary-500 text-sm md:text-base font-medium'>See all</p>
          </div>
          {
            data?.users &&
            <ChartComponent
              options={pieOptions}
              series={pieSeries}
              type="donut"
              width={"100%"}
              height={320}
            />
          }
        </div>
        <div className="col-span-6 md:col-span-3 rounded-lg bg-white border w-full h-[420px] overflow-y-auto">
          <div className="flex items-center justify-between p-5 border-b">
            <p className="font-semibold text-base text-gray-600 md:text-lg">Loan Requests</p>
            <p className='text-primary-500 text-sm md:text-base font-medium'>See all</p>
          </div>
          <>
            {user.map((items, i) => (
              <div key={i} className="border mx-3 sm:mx-5 my-3 p-3 sm:p-4 rounded-sm">
                <div className="flex items-center h-full">
                  <p className='font-semibold text-sm'>{items.name}</p>
                  <span className="h-[30px] sm:h-[20px] w-[0.5px] border-[0.5px] bg-[#F9F9F9] mx-2" />
                  <p className='font-semibold text-sm'>{items.pharmacyName}</p>
                </div>
                <div className="flex items-center justify-between pt-3">
                  <p className='text-sm'>Loan amount: <span className='font-semibold'>{items.amount}</span></p>
                  <p className='text-sm'>Credit Score: <span className={`${items.creditScore === "75%" ? "text-green-600" :
                      items.creditScore === "45%" ? "text-orange-500" : "text-red-600"
                    } font-semibold`}>{items.creditScore}</span></p>
                </div>
              </div>
            ))}
          </>
        </div>
      </div>
    </div>
  )
}

export default ActivityCharts;