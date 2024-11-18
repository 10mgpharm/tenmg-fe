import { CircleCheck, CircleX } from "lucide-react"
import PurchaseCard from "./PurchaseCard"

const PurchasePattern = () => {
  return (
    <div className="space-y-5 mt-5">
        <div className="flex items-center gap-5">
            <PurchaseCard value="6" icon={CircleCheck} type="past" />
            <PurchaseCard value="₦500,000" icon={CircleCheck} type="past"/>
        </div>
        <div className="flex items-center gap-5">
            <PurchaseCard value="1" icon={CircleX} type="active" />
            <PurchaseCard value="₦300,000" icon={CircleX} type="active"/>
        </div>
        <div className="flex items-center gap-5">
            <PurchaseCard value="5" icon={CircleX} type="late" />
            <PurchaseCard value="25" icon={CircleX} type="late"/>
        </div>
    </div>
  )
}

export default PurchasePattern