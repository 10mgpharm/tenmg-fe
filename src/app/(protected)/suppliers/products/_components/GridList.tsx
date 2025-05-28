import Link from 'next/link'
import { 
    Box,
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
import { ProductDataProps, ProductResponseData } from '@/types'
import { Dispatch, SetStateAction } from 'react'
import Pagination from '@/app/(protected)/admin/products/_components/Pagination'

const GridList = (
    {
        product, 
        routing, 
        selectedProduct, 
        setSelectedProduct, 
        fetchProducts, 
        type,
        isLoading,
        deleteFn,
        onOpenFlag,
        onOpenUnflag,
        onOpenDeactivate,
        onOpenActivate,
        setPageCount
    }: 
    {
        product: ProductResponseData, 
        routing: string, 
        selectedProduct: ProductDataProps, 
        setSelectedProduct: Dispatch<SetStateAction<ProductDataProps>>, 
        setPageCount: Dispatch<SetStateAction<number>>, 
        fetchProducts: () => void, 
        type: string,
        isLoading: boolean,
        deleteFn: () => void,
        onOpen: () => void,
        onOpenFlag?: () => void,
        onOpenUnflag?: () => void,
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
    <div className="">
        <div className='grid sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-5'>
            {
                product?.data?.map((item: ProductDataProps) => (
                    <div key={item.id} className="bg-white p-2 rounded-md relative">
                        <div className="absolute top-4 inset-x-4 flex items-center justify-between">
                            <div className={
                                classNames('bg-white max-w-max px-2 rounded-full shadow-sm')}>
                                <Text fontSize={"12px"} fontWeight={600} textTransform={"capitalize"}>
                                    {item?.category?.name}
                                </Text>
                            </div>
                            <Menu>
                                <MenuButton className='bg-white shadow-sm p-2 rounded-full'>
                                    <BsThreeDotsVertical className="w-5 h-auto"/>
                                </MenuButton>
                                <MenuList dir='ltr'>
                                    <MenuItem>
                                        <Link href={`${routing}/${item.id}`} className='text-sm'>View Product</Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link href={`${routing}/edit/${item.id}`} className='text-sm'>Edit Product</Link>
                                    </MenuItem>
                                    <MenuItem 
                                        fontSize={"sm"}
                                        onClick={() => {
                                            setSelectedProduct(item)
                                            onOpenRestock()
                                        }}
                                    >
                                        Restock
                                    </MenuItem>
                                    {
                                        (type === "admin") &&
                                        <>
                                        {
                                            item.status === "FLAGGED" ? 
                                            <MenuItem 
                                                fontSize={"sm"}
                                                onClick={() => {
                                                    setSelectedProduct(item)
                                                    onOpenUnflag();
                                                }}
                                            >
                                                Unflag Product
                                            </MenuItem>
                                            : 
                                            <MenuItem 
                                                fontSize={"sm"}
                                                onClick={() => {
                                                    setSelectedProduct(item)
                                                    onOpenFlag();
                                                }}
                                            >
                                                Flag Product
                                            </MenuItem>
                                        }
                                        </>
                                    }
                                    {
                                        (item?.status === "ACTIVE" || item?.status === "APPROVED") ? 
                                        <MenuItem 
                                        fontSize={"sm"}
                                        onClick={() => {
                                            setSelectedProduct(item)
                                            onOpenDeactivate()
                                        }}>
                                            Deactivate Product
                                        </MenuItem>
                                        : <MenuItem 
                                        fontSize={"sm"}
                                        onClick={() => {
                                            setSelectedProduct(item)
                                            onOpenActivate()}
                                        }>
                                            Activate Product
                                        </MenuItem>
                                    }
                                    <MenuItem 
                                    fontSize={"sm"}
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
                        {
                            item.thumbnailFile &&
                            <img 
                            src={item.thumbnailFile}
                            alt=''  
                            className='rounded-md w-full h-[200px]'
                            />
                        }
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
                                    item.status === "ACTIVE" ? 
                                    "bg-green-50 text-green-500" : 
                                    item.status === "PENDING" ? 
                                    "bg-orange-50 text-orange-500":
                                    item.status === "APPROVED" ? 
                                    "text-blue-500 bg-blue-50" :
                                    "bg-red-50 text-red-500" , 
                                    ' max-w-max px-2 rounded-full')}
                                >
                                    <Text fontSize={"12px"}>{item?.status === "APPROVED" ? "Active" : item?.status}</Text>
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
        <Pagination 
            links={product?.links}
            prevPageUrl={product?.prevPageUrl}
            nextPageUrl={product?.nextPageUrl}
            firstPageUrl={product?.firstPageUrl} 
            lastPageUrl={product?.lastPageUrl}
            setPageCount={setPageCount}
            currentPage={product?.currentPage}
        />
    </div>
  )
}

export default GridList;