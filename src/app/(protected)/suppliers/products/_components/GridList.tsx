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
import { ProductDataProps } from '@/types'
import { Dispatch, SetStateAction } from 'react'

const GridList = (
    {
        data, 
        routing, 
        selectedProduct, 
        setSelectedProduct, 
        fetchProducts, 
        type,
        isLoading,
        deleteFn,
        onOpen,
        onOpenDeactivate,
        onOpenActivate,
    }: 
    {
        data: ProductDataProps[], 
        routing: string, 
        selectedProduct: 
        ProductDataProps, 
        setSelectedProduct: Dispatch<SetStateAction<ProductDataProps>>, 
        fetchProducts: () => void, 
        type: string,
        isLoading: boolean,
        deleteFn: () => void,
        onOpen: () => void,
        onOpenDeactivate: () => void,
        onOpenActivate: () => void,
    }
) => {

    const { 
        isOpen: isOpenRestock, 
        onClose: onCloseRestock, 
        onOpen: onOpenRestock 
    } = useDisclosure();
    const { 
        isOpen: isOpenDelete, 
        onClose: onCloseDelete, 
        onOpen: onOpenDelete 
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
                            <MenuList dir='ltr'>
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
                                    (item?.status === "ACTIVE" || item?.status === "APPROVED") ? 
                                    <MenuItem onClick={() => {
                                        setSelectedProduct(item)
                                        onOpenDeactivate()
                                    }}>
                                        Deactivate Product
                                    </MenuItem>
                                    : <MenuItem 
                                    onClick={() => {
                                        setSelectedProduct(item)
                                        onOpenActivate()}
                                    }>
                                        Activate Product
                                    </MenuItem>
                                }
                                <MenuItem 
                                onClick={() => {
                                    setSelectedProduct(item)
                                    onOpenDelete()
                                }} 
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
                                item.inventory === "ACTIVE" ? 
                                "bg-green-50 text-green-500" : 
                                item.status === "PENDING" ? 
                                "bg-orange-50 text-orange-500":
                                item.status === "APPROVED" ? 
                                "text-blue-500 bg-blue-50" :
                                "bg-red-50 text-red-500" , 
                                ' max-w-max px-2 rounded-full')}
                            >
                                <Text fontSize={"12px"}>{item?.status}</Text>
                            </Box>
                        </div>
                    </div>
                </div>
            ))
        }
        <DeleteModal 
        isOpen={isOpenDelete} 
        onClose={onCloseDelete}
        isLoading={isLoading}
        deleteFn={deleteFn}
        />
        <RestockModal 
        isOpen={isOpenRestock} 
        onClose={onCloseRestock} 
        product={selectedProduct} 
        fetchProducts={fetchProducts}
        type={type}
        />
    </div>
  )
}

export default GridList;