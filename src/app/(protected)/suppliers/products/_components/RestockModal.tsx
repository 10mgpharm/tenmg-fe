import requestClient from '@/lib/requestClient';
import { NextAuthUserSession, ProductDataProps } from '@/types'
import { handleServerErrorMessage } from '@/utils';
import { 
    Button,
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
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface IFormInput {
    name: string;
    currentStock: string;
    quantity: number;
}
const RestockModal = (
    {isOpen, onClose, product, fetchProducts, type}: 
    {isOpen: boolean, onClose: () => void, product: ProductDataProps, fetchProducts: () => void, type: string}
) => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
        setValue,
        reset,
    } = useForm<IFormInput>({
        mode: "onChange",
    });

    useEffect(() => {
        if(product){
            setValue("name", product.name);
            setValue("currentStock", product.quantity);
        }
    },[product, setValue, isOpen]);

    const onSubmit:SubmitHandler<IFormInput>  = async(data) => {
        try {
            setIsLoading(true)
            const totalQuantity = Number(data.quantity) + Number(data.currentStock);
            let response: any;
            if(type === "admin"){
                response = await requestClient({token: token}).patch(
                    `/admin/settings/products/${product.id}`,
                    {quantity: totalQuantity}
                )
            }else if(type === "supplier"){
                response = await requestClient({token: token}).patch(
                    `/supplier/products/${product.id}`,
                    {quantity: totalQuantity}
                )
            }
            if(response.status === 200){
                toast.success(response.data?.message);
                reset();
                fetchProducts()
                setIsLoading(false);
                onClose();
            }
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            toast.error(handleServerErrorMessage(error));
        }
    }

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
                        disabled
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
                    <div className="flex flex-col gap-1.5 pt-4">
                        <Button 
                        type='submit' 
                        isLoading={isLoading} 
                        disabled={isLoading} 
                        loadingText="Submitting..." 
                        className='bg-primary-500 text-white p-3 rounded-md'>
                            Restock
                        </Button>
                        <Button variant={"outline"} onClick={() => onClose()}>Cancel</Button>
                    </div>
                </form>
            </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default RestockModal