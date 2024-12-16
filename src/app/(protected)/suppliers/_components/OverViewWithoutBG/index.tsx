import Image from "next/image"

const OverviewCardWithoutBG = (
    {title, value, icon, }: 
    {title: string, value: string, icon?: any}
) => {
    return(
        <div className="bg-white border shadow-sm rounded-lg">
            <div className="flex items-center justify-between py-10 px-6">
                <div className="">
                    <p className="text-gray-600 text-base mb-1">{title}</p>
                    <p className="font-medium text-gray-800 text-2xl">{value}</p>
                </div>
                <Image src={icon} alt=""/>
            </div>
        </div>
    )
}

export default OverviewCardWithoutBG;