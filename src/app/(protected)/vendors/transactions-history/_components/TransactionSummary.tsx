import { SingleDataProps } from "./Records"
import ChartComponent from "../../_components/ChartComponent"
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TransactionSummary: React.FC<SingleDataProps> = ({tnxHistoryData}) => {

    const months = tnxHistoryData?.evaluation?.purchasePattern?.listOfTransactingMonths?.map((item: any) => item.month);
    const sums = tnxHistoryData?.evaluation?.purchasePattern?.listOfTransactingMonths?.map((item: any) => item.sum);

    const formatValue = (value: any) => {
        if (value >= 1000000) {
          return `₦${(value / 1000000).toFixed(1)}M`; // Format as millions
        } else if (value >= 1000) {
          return `₦${(value / 1000).toFixed(1)}K`; // Format as thousands
        } else {
          return ` ₦${value.toFixed(1)}`; // For smaller values, just round
        }
      };

    const options: ApexOptions = {
        chart: {
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false
            },
            events: {
                mouseMove: function (event) {
                // Prevent moving the chart on scroll
                    event?.preventDefault();
                },
                // wheel: function (event) {
                // event.preventDefault(); // Prevent scroll zooming or panning
                // },
            },
            // foreceNonPassive: true,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 1
        },
        yaxis: {
          show: true,
          labels: {
            formatter: formatValue // Format y-axis labels
          }
        },
        xaxis: {
          categories: months,
        },
        legend: {
          show: true,
        },
        // tooltip: {
        //     x: {
        //         format: 'MM yyyy'
        //     },
        //     y: {
        //         formatter: formatValue
        //     }
        // },
    };

     const series = [
        {
            name: "Sum",
            data: sums,
        },
    ];

    const chartRef = useRef(null);

//   useEffect(() => {
//     // Disable pan and scroll (wheel) on the chart container
//     const chartContainer = chartRef.current;

//     const preventWheel = (event) => {
//       event.preventDefault(); // Prevent zoom on scroll
//     };

//     const preventMouseMove = (event) => {
//       event.preventDefault(); // Prevent panning on mouse move
//     };

//     // Add event listeners with passive: false
//     chartContainer.addEventListener('wheel', preventWheel, { passive: false });
//     chartContainer.addEventListener('mousemove', preventMouseMove, { passive: false });

//     // Cleanup event listeners on component unmount
//     return () => {
//       chartContainer.removeEventListener('wheel', preventWheel);
//       chartContainer.removeEventListener('mousemove', preventMouseMove);
//     };
//   }, []);

    return (
    <div className="border p-5 rounded-md">
        <p className="font-medium mb-4">Transaction Summary</p>
        <div className="flex gap-10">
            <div className="space-y-5">
                <div className="">
                    <p className="text-sm mb-1">First Day in Transaction:</p>
                    <p>Feb 11, 2024</p>
                </div>
                <div className="">
                    <p className="text-sm mb-1">Last Day in Transaction:</p>
                    <p>Feb 11, 2024</p>
                </div>
                <div className="border border-primary-500 w-[200px] p-3 rounded-md bg-primary-100">
                    <p className="text-sm leading-5">Transaction is equal or above 6 months</p>
                </div>
            </div>
            <div ref={chartRef} className="flex-1">
                <ChartComponent
                  options={options}
                  series={series}
                  type="area"
                  width={"100%"}
                  height={320}
                />
                <p className="text-center font-medium mt-3">Monthly Spending</p>
            </div>
        </div>
    </div>
  )
}

export default TransactionSummary