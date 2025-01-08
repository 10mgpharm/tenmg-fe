import { camelCaseToTitleCase, classNames } from "@/utils";
import { Flex, Icon, Text, Tooltip } from "@chakra-ui/react"
import { Info } from "lucide-react";

interface PurchaseProps {
    value: number;
    systemValue: string;
    title: string;
    icon: any;
    operator: string;
    status: string;
    description: string;
}

const PurchaseCard:React.FC<PurchaseProps> = ({value, title, icon, status, operator, systemValue, description}) => {

  return (
    <div className={
        classNames(
        status === "passed" ? 
        "border-green-500 bg-[#D1EFEC]" 
        : "border-red-600 bg-[#F6DADE]",  
        " border p-4 rounded-md col-span-1 space-y-4")}
    >
        <Flex align={"center"} justify={"space-between"}>
            <Text className="text-sm text-gray-600 w-3/4">{camelCaseToTitleCase(title)}</Text>
            <Tooltip label={description} aria-label='A tooltip' width={"128px"}>
                <Info className="w-4 h-4"/>
            </Tooltip>
        </Flex>
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
                Analysis result {operator} {Number(systemValue)?.toLocaleString()}
            </Text>
            <Icon 
            as={icon} 
            className={
                classNames(
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