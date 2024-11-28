
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
import { MedicationTypeProp, defaultRecords } from "./AddMedicationType";
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
    const [data, setData] = useState<MedicationTypeProp[]>(defaultRecords);
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
                        data?.map((item, index) => (
                            <Tr key={index}>
                                <Td fontSize={"14px"}>{item.category}</Td>
                                <Td fontSize={"14px"}>{item.strength}</Td>
                                <Td fontSize={"14px"}>{item.value}</Td>
                                <Td fontSize={"14px"}>{item.package}</Td>
                                <Td fontSize={"14px"}>{item.presentation}</Td>
                                <Td>
                                    <Flex gap={2}>
                                    <Button fontSize={"14px"} variant={"unstyled"} color={"gray.500"}>Edit</Button>
                                    <Button fontSize={"14px"} variant="unstyled" color={"red.600"}>Delete</Button>
                                    </Flex>
                                </Td>
                            </Tr>
                        ))
                    }
                    {/* <Tr>
                    <Td px={0}>
                        <Select 
                        {...register("type.category", {
                            required: "Category is required",
                        })}
                        pl={-2} 
                        fontSize={"14px"} 
                        minW={"fit-content"} 
                        border={"none"} 
                        placeholder="Select category">
                            <option value="Syrup">Syrup</option>
                            <option value="Tablet">Tablet</option>
                        </Select>
                    </Td>
                    <Td>
                        <Input 
                        {...register("type.strength", {
                        required: "Strength is required",
                        })}
                        px={0} 
                        minW={"fit-content"} 
                        border={"none"}
                        placeholder="Strength" 
                        type="text"/>
                    </Td>
                    <Td>
                        <Input 
                        px={0} 
                        minW={"fit-content"} 
                        border={"none"} 
                        placeholder="Strength Value" 
                        type="text"
                        {...register("type.value", {
                            required: "Strength value is required",
                        })}
                        />
                    </Td>
                    <Td>
                        <Input 
                        px={0} 
                        minW={"fit-content"} 
                        border={"none"} 
                        placeholder="Presentation" type="text"
                        {...register("type.presentation", {
                            required: "Presentation is required",
                        })}
                        />
                    </Td>
                    <Td>
                        <Input 
                        px={0} 
                        minW={"fit-content"}
                        border={"none"} 
                        placeholder="Package Per Roll" 
                        type="text"
                        {...register("type.package", {
                            required: "Package is required",
                        })}
                        />
                    </Td>
                    <Td>
                        <Button onClick={addVariant} fontSize={"14px"} variant={"unstyled"} color={"blue.500"}>Add New Variant</Button>
                    </Td>
                    </Tr> */}
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