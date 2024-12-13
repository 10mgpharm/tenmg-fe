import Image from 'next/image'
import { Box, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure } from '@chakra-ui/react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { classNames } from '@/utils'
import Link from 'next/link'
import DeleteModal from './DeleteModal'
import RestockModal from './RestockModal'
import DeactiveModal from './DeactiveModal'
import { ProductDataProps } from '@/types'

const GridList = ({data}: {data: ProductDataProps[]}) => {

    const { isOpen, onClose, onOpen } = useDisclosure();
    const { isOpen: isOpenRestock, onClose: onCloseRestock, onOpen: onOpenRestock } = useDisclosure();
    const { isOpen: isOpenDeactivate, onClose: onCloseDeactivate, onOpen: onOpenDeactivate } = useDisclosure();
    
  return (
    <div className='grid grid-cols-3 gap-5'>
        {
            data?.map((item: ProductDataProps) => (
                <div key={item.id} className="bg-white p-2 rounded-md relative">
                    <div className="absolute top-4 inset-x-4 flex items-center justify-between">
                        <div className={
                            classNames(
                                item.inventory === "IN STOCK" ? 
                                "bg-green-50 text-green-500" : 
                                "bg-red-50 text-red-500" , 
                                ' max-w-max px-2 rounded-full')}>
                            <Text fontSize={"13px"}>{item.inventory}</Text>
                        </div>
                        <Menu>
                            <MenuButton>
                                <BsThreeDotsVertical className="w-5 h-auto"/>
                            </MenuButton>
                            <MenuList dir='rtl'>
                                <MenuItem>
                                    <Link href={`/admin/products/${item.slug}`}>View Details</Link>
                                </MenuItem>
                                <MenuItem>Edit Product</MenuItem>
                                <MenuItem onClick={() => onOpenRestock()}>Flag</MenuItem>
                                {
                                    item?.status === "ACTIVE" ? 
                                    <MenuItem onClick={() => onOpenDeactivate()}>Deactivate Product</MenuItem>
                                    : <MenuItem onClick={() => onOpenDeactivate()}>Activate Product</MenuItem>
                                }
                                <MenuItem onClick={() => onOpen()} color="red.500">Remove Product</MenuItem>
                            </MenuList>
                        </Menu>
                    </div>
                    <Image src={item.thumbnailFile} alt='' width={300} height={300} className='rounded-md w-full h-[200px]'/>
                    <div className="mt-3 mb-6">
                        <div className="flex items-center justify-between">
                            <h3 className='font-semibold'>{item?.name}</h3>
                            <p className='font-semibold'>{item?.price}</p>
                        </div>
                        <p className='text-gray-500'>{item?.brand?.name}</p>
                        <div className="flex justify-between items-center mt-3">
                            <p className='font-medium'>{item.quantity} Qty</p>
                            <Box bg={"#FFFAEB"} color={"#F79009"} px={2} maxW={"fit-content"}>
                                <Text fontSize={"13px"}>{item?.status}</Text>
                            </Box>
                        </div>
                    </div>
                </div>
            ))
        }
        <DeleteModal isOpen={isOpen} onClose={onClose}/>
        <RestockModal isOpen={isOpenRestock} onClose={onCloseRestock}/>
        <DeactiveModal isOpen={isOpenDeactivate} onClose={onCloseDeactivate}/>
    </div>
  )
}

export default GridList