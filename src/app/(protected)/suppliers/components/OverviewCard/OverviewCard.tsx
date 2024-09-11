import Image from "next/image"
import { classNames } from "@/utils"

const OverviewCard = (
    {title, value, icon, fromColor, toColor, image}: 
    {title: string, value: string, icon?: any, fromColor: string, toColor: string, image: string}
) => {
  return (
    <div className={classNames(`bg-gradient-to-r ${fromColor} ${toColor} rounded-lg relative`)}>
        <div className="flex items-center justify-between py-16 px-6">
            <div className="">
                <p className="text-white text-base mb-1">{title}</p>
                <p className="font-medium text-white text-2xl">{value}</p>
            </div>
            <Image src={icon} alt=""/>
        </div>
        <div className="absolute top-3 inset-x-0 mx-auto">
            <Image src={image} alt="" className="mx-auto"/>
        </div>
    </div>
  )
}

export default OverviewCard