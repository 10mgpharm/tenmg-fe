import Image from "next/image"

const OverviewCardWithoutBG = (
    {title, value, icon, }: 
    {title: string, value: string, icon?: any}
) => {
    return(
        <div className="bg-white border shadow-sm rounded-lg w-full">
            <div className="flex items-center justify-between py-6 md:py-10 px-4 md:px-6">
                <div className="flex-1">
                    <p className="text-gray-600 text-sm md:text-base mb-1">{title}</p>
                    <p className="font-medium text-gray-800 text-xl md:text-2xl">{value}</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                    <Image src={icon} alt={title} className="w-8 h-8 md:w-auto md:h-auto" />
                </div>
            </div>
        </div>
    )
}

export default OverviewCardWithoutBG;