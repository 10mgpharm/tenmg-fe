import { ProductDataProps } from '@/types'
import { 
    FormControl, 
    FormLabel, 
    Input, 
    Modal, 
    ModalBody, 
    ModalCloseButton, 
    ModalContent, 
    ModalHeader, 
    ModalOverlay,  
} from '@chakra-ui/react'
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface IFormInput {
    name: string;
    currentStock: string;
    quantity: number;
}
const RestockModal = (
    {isOpen, onClose, product}: 
    {isOpen: boolean, onClose: () => void, product: ProductDataProps}
) => {

    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
        setValue,
    } = useForm<IFormInput>({
        mode: "onChange",
    });

    useEffect(() => {
        if(product){
            setValue("name", product.name);
            setValue("currentStock", product.quantity);
        }
    },[product])

    const onSubmit:SubmitHandler<IFormInput>  = async(data) => {}

    return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>
            <h3 className='text-xl font-semibold'>Restock Product</h3>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <form onSubmit={handleSubmit(onSubmit)} className="text-center mb-8 space-y-4">
                    <FormControl isInvalid={!!errors.name}>
                        <FormLabel>Product Name</FormLabel>
                        <Input
                            id='name'
                            disabled
                            placeholder='Synthetic opioids'
                            isInvalid={!!errors.name}
                            _focus={{
                                border: !!errors.name ? "red.300" : "border-gray-300",
                            }}
                            {...register("name", {
                                required: true,
                            })}
                         />
                    </FormControl>
                    <FormControl isInvalid={!!errors.currentStock}>
                        <FormLabel>Current Stock</FormLabel>
                        <Input 
                        id='currentStock'
                        type='number' 
                        placeholder=''
                        isInvalid={!!errors.currentStock}
                            _focus={{
                                border: !!errors.currentStock ? "red.300" : "border-gray-300",
                            }}
                            {...register("currentStock", {
                                required: true,
                            })}
                        />
                    </FormControl>
                    <FormControl isInvalid={!!errors.quantity}>
                        <FormLabel>Desired Quantity</FormLabel>
                        <Input 
                        id='quantity'
                        type='number' 
                        placeholder=''
                        isInvalid={!!errors.quantity}
                            _focus={{
                                border: !!errors.quantity ? "red.300" : "border-gray-300",
                            }}
                            {...register("quantity", {
                                required: true,
                            })}
                        />
                    </FormControl>
                    <div className="flex flex-col gap-3 pt-5">
                        <button type='submit' className='bg-primary-500 text-white p-3 rounded-md'>
                            Restock
                        </button>
                        <button className='cursor-pointer mt-2' onClick={() => onClose()}>Cancel</button>
                    </div>
                </form>
            </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default RestockModal