import Link from 'next/link'
import { 
    Box, 
    Image, 
    Menu, 
    MenuButton, 
    MenuItem, 
    MenuList, 
    Text, 
    useDisclosure 
} from '@chakra-ui/react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { classNames } from '@/utils'
import DeleteModal from './DeleteModal'
import RestockModal from './RestockModal'
import DeactiveModal from './DeactiveModal'
import { ProductDataProps } from '@/types'
import { Dispatch, SetStateAction } from 'react'

const GridList = (
    {data, routing, selectedProduct, setSelectedProduct}: 
    {data: ProductDataProps[], routing: string, selectedProduct: ProductDataProps, setSelectedProduct: Dispatch<SetStateAction<ProductDataProps>>}) => {

    const { isOpen, onClose, onOpen } = useDisclosure();
    const { 
        isOpen: isOpenRestock, 
        onClose: onCloseRestock, 
        onOpen: onOpenRestock } = useDisclosure();
    const { 
        isOpen: isOpenDeactivate, 
        onClose: onCloseDeactivate, 
        onOpen: onOpenDeactivate 
    } = useDisclosure();
    
  return (
    <div className='grid grid-cols-3 2xl:grid-cols-4 gap-5'>
        {
            data?.map((item: ProductDataProps) => (
                <div key={item.id} className="bg-white p-2 rounded-md relative">
                    <div className="absolute top-4 inset-x-4 flex items-center justify-between">
                        <div className={
                            classNames('bg-white max-w-max px-2 rounded-full shadow-sm')}>
                            <Text fontSize={"13px"} fontWeight={600} textTransform={"capitalize"}>
                                {item?.category?.name}
                            </Text>
                        </div>
                        <Menu>
                            <MenuButton className='bg-white shadow-sm p-2 rounded-full'>
                                <BsThreeDotsVertical className="w-5 h-auto"/>
                            </MenuButton>
                            <MenuList dir='rtl'>
                                <MenuItem>
                                    <Link href={`${routing}/${item.id}`}>View Product</Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link href={`${routing}/edit/${item.id}`}>Edit Product</Link>
                                </MenuItem>
                                <MenuItem 
                                    onClick={() => {
                                        setSelectedProduct(item)
                                        onOpenRestock()
                                    }}
                                >
                                    Restock
                                </MenuItem>
                                {
                                    item?.status === "ACTIVE" ? 
                                    <MenuItem onClick={() => onOpenDeactivate()}>Deactivate Product</MenuItem>
                                    : <MenuItem onClick={() => onOpenDeactivate()}>Activate Product</MenuItem>
                                }
                                <MenuItem 
                                onClick={() => onOpen()} 
                                color="red.500">
                                    Delete Product
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </div>
                    <Image 
                    src={item.thumbnailFile} 
                    fallbackSrc=''
                    alt=''  
                    className='rounded-md w-full h-[200px]'
                    />
                    <div className="mt-3 mb-6 px-2">
                        <div className="flex items-center justify-between">
                            <h3 className='font-semibold capitalize'>{item?.name}</h3>
                            <p className='font-semibold'>₦{Number(item?.actualPrice).toLocaleString()}</p>
                        </div>
                        <p className='text-gray-500 capitalize'>{item?.brand?.name}</p>
                        <div className="flex justify-between items-center mt-3">
                            <p className='font-medium text-sm'>{item.quantity} Qty</p>
                            <Box px={2} maxW={"fit-content"} 
                            className={
                                classNames(
                                item.inventory === "IN STOCK" ? 
                                "bg-green-50 text-green-500" : 
                                "bg-red-50 text-red-500" , 
                                ' max-w-max px-2 rounded-full')}
                            >
                                <Text fontSize={"12px"}>{item?.inventory}</Text>
                            </Box>
                        </div>
                    </div>
                </div>
            ))
        }
        <DeleteModal isOpen={isOpen} onClose={onClose}/>
        <RestockModal isOpen={isOpenRestock} onClose={onCloseRestock} product={selectedProduct}/>
        <DeactiveModal isOpen={isOpenDeactivate} onClose={onCloseDeactivate}/>
    </div>
  )
}

export default GridList