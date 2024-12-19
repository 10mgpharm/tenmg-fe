
"use client";
import { 
    Button,
    Drawer, 
    DrawerBody, 
    DrawerCloseButton, 
    DrawerContent, 
    DrawerFooter, 
    DrawerHeader, 
    DrawerOverlay, 
    Flex, 
    FormControl, 
    FormLabel, 
    HStack, 
    Input, 
    Select, 
    Switch, 
    Table, 
    TableContainer, 
    Tbody, 
    Td, 
    Text, 
    Th, 
    Thead,
    Tr
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { MedicationTypeProp } from "./AddMedicationType";
import requestClient from "@/lib/requestClient";
import { handleServerErrorMessage } from "@/utils";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { MedicationData, NextAuthUserSession } from "@/types";
import Image from "next/image";
import shape from "@public/assets/images/Rectangle 43.svg";

interface IFormInput {
    name: string;
    status: string;
    isActive: string;
    // type: MedicationTypeProp;
}

const EditMedicationType = (
    { isOpen, onClose , medication, fetchingMedicationTypes}: 
    { isOpen: boolean; onClose: () => void; medication: MedicationData; fetchingMedicationTypes: () => void}) => {

    const session = useSession();
    const sessionToken = session?.data as NextAuthUserSession;
    const token = sessionToken?.user?.token;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
        control,
        reset,
    } = useForm<IFormInput>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setIsLoading(true)
        try {
            const response = await requestClient({token: token}).patch(
                `/admin/settings/medication-types/${medication?.id}`,
                data
            )
            if(response.status === 200){
                toast.success(response.data?.message);
                fetchingMedicationTypes()
                setIsLoading(false);
                reset();
                onClose();
            }
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            toast.error(handleServerErrorMessage(error));
        }
    };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"xl"}>
    <DrawerOverlay />
    <DrawerContent>
      <DrawerCloseButton />
      <DrawerHeader className="capitalize">Edit Medication Type</DrawerHeader>
      <DrawerBody>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.name?.message}>
                <FormLabel>Name</FormLabel>
                <Input
                    type={"text"}
                    placeholder=""
                    defaultValue={medication?.name}
                    {...register("name", {
                    required: "Name is required",
                    })}
                />
                {errors.name && (
                <Text as={"span"} className="text-red-500 text-sm">
                    {errors.name?.message}
                </Text>
                )}
            </FormControl>
            <FormControl mt={5} isInvalid={!!errors.status?.message}>
                <FormLabel>Status</FormLabel>
                <Select  
                    defaultValue={medication?.status}
                    {...register("status", {
                    required: "Status is required",
                    })} 
                    placeholder="select status">
                    <option value="APPROVED">Approved</option>
                    <option value="PENDING">Pending</option>
                    {/* <option value="pending">Pending Review</option> */}
                </Select>
                {errors.status && (
                <Text as={"span"} className="text-red-500 text-sm">
                    {errors.status?.message}
                </Text>
                )}
            </FormControl>
            <FormControl mt={5} display='flex' gap={2} alignItems='center'>
                <Controller
                    name="isActive"
                    defaultValue={medication?.active ? "true": "false"}
                    control={control}
                    render={({ field }) => <Switch {...field} />}
                />
                <FormLabel htmlFor='active' mb='0'>
                    Active
                </FormLabel>
            </FormControl>
            <TableContainer mt={5}>
                <Table variant='simple' border={"1px solid #EAECF0"} rounded={"md"}>
                <Thead bg={"#E8F1F8"}>
                    <Tr color={"primary.500"} roundedTop={"md"}>
                    <Th>Variant Category</Th>
                    <Th>Strength</Th>
                    <Th>Strenght Value</Th>
                    <Th>Presentation</Th>
                    <Th>Package Per Roll</Th>
                    <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                    }
                </Tbody>
                </Table>
            </TableContainer>
            <HStack mt={5} justify={"end"}>
                <Flex gap={3}>
                <Button w={"120px"} onClick={onClose} variant={"outline"}>
                    Cancel
                </Button>
                <Button
                    w={"260px"}
                    type="submit"
                    isDisabled={isLoading}
                    isLoading={isLoading}
                    loadingText="Submitting..."
                    className="bg-primary-500 text-white"
                >
                    Save Changes
                </Button>
                </Flex>
            </HStack>
        </form>
      </DrawerBody>
      <DrawerFooter p={0}>
        <Image src={shape} alt="" />
      </DrawerFooter>
    </DrawerContent>
    </Drawer>
  )
}

export default EditMedicationType