import React from "react"
import PurchaseCard from "./PurchaseCard"
import { ResultBreakdownProps } from "@/types"
import { FaCheckCircle } from "react-icons/fa"
import { FaCircleXmark } from "react-icons/fa6"
interface Props {
  data: ResultBreakdownProps[]
}

const PurchasePattern: React.FC<Props> = ({data}) => {
  return (
    <div className="space-y-5 mt-5">
      <div className="grid grid-cols-2 gap-5">
        {
          data?.map((item: ResultBreakdownProps) => (
            <PurchaseCard 
            key={item.rulename}
            value={item.systemValue} 
            icon={item.status === "passed" ? FaCheckCircle : FaCircleXmark} 
            status={item.status} 
            operator={item.operator}
            weight={item.weight}
            title={item.ruleDescription}
            />
          ))
        }
      </div>
    </div>
  )
}

export default PurchasePattern