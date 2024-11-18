import { classNames } from "@/utils";
import { Icon, Text } from "@chakra-ui/react"
import { CircleCheck } from "lucide-react"

interface PurchaseProps {
    value: string;
    icon: any;
    type: "past" | "active" | "late"
}

const PurchaseCard = ({value, icon, type}: PurchaseProps) => {
  return (
    <div className={classNames(type === "past" ? "border-green-500 bg-[#D1EFEC]" : "border-red-600 bg-[#F6DADE]",  " border p-4 rounded-md flex-1 space-y-4")}>
        <p className="text-sm text-gray-600">Total Past Credit Count is</p>
        <Text 
        fontWeight={"600"}
        fontSize={"large"}
        color={type === "past" ? "green.600": type === "active" ? "red.600" : "black"} 
        >
            {value}
        </Text>
        <div className="flex justify-between items-center">
            <Text 
            fontSize={"small"}
            fontWeight={600}
            color={type === "past" ? "green.700": type === "active" ? "red.600" : "black"} 
            >
                Analysis result {'> ='} 1
            </Text>
            <Icon as={icon} className={classNames(type === "past" ? "text-green-600" : "text-red-600" ,"w-4 h-4")}/>
        </div>
    </div>
  )
}

export default PurchaseCard