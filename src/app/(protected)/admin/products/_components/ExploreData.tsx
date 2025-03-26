import { Clock } from "lucide-react"
import { options } from "@/app/(protected)/suppliers/SupplierDashboard";
import ChartComponent from "@/app/(protected)/vendors/_components/ChartComponent";

const ExploreData = () => {

    const chartoptions: ApexCharts.ApexOptions = {
        chart: {
          type: "bar",
          stacked: true,
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            isFunnel3d: true,
            borderRadiusWhenStacked: "all",
            // borderRadius: 5,
            borderRadiusApplication: "end"
            // endingShape: "rounded",
          },
        },
        colors: ["#7F56D9", "#2970FF"],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          categories: ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"],
          labels: {
            style: { fontSize: "12px", colors: "#333" },
          },
        },
        yaxis: {
          labels: {
            formatter: (val) => val.toFixed(0),
          },
        },
        fill: {
          opacity: 1,
        },
        legend: {
            show: false
        },
        grid: {
          show: true,
        },
      };
    
    const series = [
        {
          name: "Total Visits",
          data: [7, 6, 19, 6, 6, 10, 0],
        },
        {
          name: "Total Orders",
          data: [5, 4, 0, 6, 2, 6, 0],
        },
    ];
  return (
    <div className="mt-5">
        <div className="flex items-center justify-between">
            <div className="max-w-sm space-y-1">
                <h3 className="font-semibold">Explore your data</h3>
                <p className="text-gray-500 text-sm">
                    How many visits result in an order? Look for trends and relationships between your numbers
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500"/>
                <p className="text-gray-600">Updated just now</p>
            </div>
        </div>
        <div className="mt-4 p-5 rounded-md bg-white">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-4 border-[#7F56D9]"/>
                        <p>Total Visits</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-4 border-[#2970FF]"/>
                        <p>Total Orders</p>
                    </div>
                </div>
                <div className="">
                    <select className="border p-2 rounded-lg text-gray-500 outline-none">
                        {
                          options.map((option) => (
                            <option 
                            key={option.label} 
                            value={option.value} 
                            className="text-gray-500">
                                {option.label}
                            </option>
                          ))
                        }
                    </select>
                </div>
            </div>
            <ChartComponent 
            series={series}
            options={chartoptions}
            type="bar"
            width={"100%"}
            height={360}
            />
        </div>
    </div>
  )
}

export default ExploreData