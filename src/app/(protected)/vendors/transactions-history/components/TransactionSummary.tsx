import RevenueChart from "@/app/(protected)/suppliers/components/RevenueChart"

const TransactionSummary = () => {
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
            <div className="flex-1">
                <RevenueChart />
                <p className="text-center font-medium mt-3">Monthly Spending</p>
            </div>
        </div>
    </div>
  )
}

export default TransactionSummary