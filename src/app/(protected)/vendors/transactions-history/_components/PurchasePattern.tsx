import React from "react"
import PurchaseCard from "./PurchaseCard"
import { ResultBreakdownProps } from "@/types"
import { FaCheckCircle } from "react-icons/fa"
import { FaCircleXmark } from "react-icons/fa6"
interface Props {
  data: ResultBreakdownProps[];
}

const PurchasePattern: React.FC<Props> = ({data}) => {
  return (
    <div className="space-y-5 mt-5">
      <div className="grid grid-cols-2 gap-5">
        {
          data?.filter((item) => item.ruleName !== "listOfTransactingMonths")?.map((item: ResultBreakdownProps) => (
            <PurchaseCard 
            key={item.ruleName}
            value={item.transactionValue || 0} 
            icon={item.status === "passed" ? FaCheckCircle : FaCircleXmark} 
            status={item.status} 
            operator={item.operator}
            systemValue={item.systemValue}
            title={item.ruleName}
            description={item.ruleDescription}
            />
          ))
        }
      </div>
    </div>
  )
}

export default PurchasePattern