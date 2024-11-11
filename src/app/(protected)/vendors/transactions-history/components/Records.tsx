
const Records = () => {
  return (
    <div className="grid grid-cols-3 gap-5">
        <div className="space-y-3 col-span-1">
            <div className="border rounded-md p-5">
                <div className="space-y-2">
                    <p className="text-gray-500">Total Past Credit Amount</p>
                    <h2 className="text-2xl font-semibold">₦161,060</h2>
                </div>
            </div>
            <div className="border rounded-md p-5">
                <div className="space-y-2">
                    <p className="text-gray-500">Active Credit Amount</p>
                    <h2 className="text-2xl font-semibold">₦161,060</h2>
                </div>
            </div>
            <div className="border rounded-md p-5">
                <div className="space-y-2">
                    <p className="text-gray-500">No. of Late Repayments</p>
                    <h2 className="text-2xl font-semibold">6 Months</h2>
                </div>
            </div>
        </div>
        <div className="space-y-3 col-span-1">
            <div className="border rounded-md p-5">
                <div className="space-y-2">
                    <p className="text-gray-500">Total Past Credit Amount</p>
                    <h2 className="text-2xl font-semibold">5</h2>
                </div>
            </div>
            <div className="border rounded-md p-5">
                <div className="space-y-2">
                    <p className="text-gray-500">Active Credit Amount</p>
                    <h2 className="text-2xl font-semibold">₦160</h2>
                </div>
            </div>
            <div className="border rounded-md p-5">
                <div className="space-y-2">
                    <p className="text-gray-500">No. of Late Repayments</p>
                    <h2 className="text-2xl font-semibold">0</h2>
                </div>
            </div>
        </div>
        <div className="col-span-1 border rounded-md flex justify-center flex-col">
            <p className="text-green-600 font-medium text-center">Performing</p>
        </div>
    </div>
  )
}

export default Records