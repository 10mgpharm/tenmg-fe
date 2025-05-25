import React from "react"
import { SingleTransactionData } from "@/types"

export interface SingleDataProps {
    tnxHistoryData: SingleTransactionData
}

const Records: React.FC<SingleDataProps> = ({ tnxHistoryData }) => {
    return (
        <div className="grid col-span-1 lg:grid-cols-3 gap-5">
            <div className="space-y-3 col-span-1">
                <div className="border rounded-md p-5">
                    <div className="space-y-2">
                        <p className="text-gray-500">Total Past Credit Amount</p>
                        <h2 className="text-2xl font-semibold">
                            ₦{tnxHistoryData?.evaluation?.creditPattern?.totalPastCreditCount}
                        </h2>
                    </div>
                </div>
                <div className="border rounded-md p-5">
                    <div className="space-y-2">
                        <p className="text-gray-500">Active Credit Amount</p>
                        <h2 className="text-2xl font-semibold">
                            ₦{tnxHistoryData?.evaluation?.creditPattern?.activeCreditAmount}
                        </h2>
                    </div>
                </div>
                <div className="border rounded-md p-5">
                    <div className="space-y-2">
                        <p className="text-gray-500">No. of Late Repayments</p>
                        <h2 className="text-2xl font-semibold">
                            {tnxHistoryData?.evaluation?.creditPattern?.noOfLateRepayments}
                        </h2>
                    </div>
                </div>
            </div>
            <div className="space-y-3 col-span-1">
                <div className="border rounded-md p-5">
                    <div className="space-y-2">
                        <p className="text-gray-500">No. of all Repayment</p>
                        <h2 className="text-2xl font-semibold">
                            {tnxHistoryData?.evaluation?.creditPattern?.noOfAllRepayments}
                        </h2>
                    </div>
                </div>
                <div className="border rounded-md p-5">
                    <div className="space-y-2">
                        <p className="text-gray-500">No. of Full Payment</p>
                        <h2 className="text-2xl font-semibold">
                            {tnxHistoryData?.evaluation?.creditPattern?.noOfFullRepayments}
                        </h2>
                    </div>
                </div>
                <div className="border rounded-md p-5">
                    <div className="space-y-2">
                        <p className="text-gray-500">No. of Partial Repayments</p>
                        <h2 className="text-2xl font-semibold">
                            {tnxHistoryData?.evaluation?.creditPattern?.noOfPartialRepayments}
                        </h2>
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