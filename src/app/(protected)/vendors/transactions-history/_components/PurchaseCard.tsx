import React from "react";
import { classNames } from "@/utils";
import { Icon, Text } from "@chakra-ui/react"

interface PurchaseProps {
    value: string;
    weight: number;
    title: string;
    icon: any;
    operator: string;
    status: string;
}

const PurchaseCard:React.FC<PurchaseProps> = ({value, title, icon, status, operator, weight}) => {
  return (
    <div className={classNames(
        status === "passed" ? 
        "border-green-500 bg-[#D1EFEC]" 
        : "border-red-600 bg-[#F6DADE]",  
        " border p-4 rounded-md col-span-1 space-y-4")}>
        <p className="text-sm text-gray-600">{title}</p>
        <Text 
        fontWeight={"600"}
        fontSize={"large"}
        color={status === "passed" ? "green.600": status === "failed" ? "red.600" : "black"} 
        >
            {Number(value)?.toLocaleString()}
        </Text>
        <div className="flex justify-between items-center">
            <Text 
            fontSize={"small"}
            fontWeight={600}
            color={status === "passed" ? "green.700": status === "failed" ? "red.600" : "black"} 
            >
                Analysis result {operator} {weight}
            </Text>
            <Icon 
            as={icon} 
            className={classNames(
                status === "passed" 
                ? "text-green-600" 
                : "text-red-600" 
                ,"w-4 h-4")}
            />
        </div>
    </div>
  )
}

export default PurchaseCard