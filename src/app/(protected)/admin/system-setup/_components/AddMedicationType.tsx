
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
    IconButton,
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
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import shape from "@public/assets/images/Rectangle 43.svg";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { handleServerErrorMessage } from "@/utils";
import { toast } from "react-toastify";
import CustomCreatableSelectComponent, { CreatableSelectOption } from "@/app/(protected)/_components/CustomCreatableSelect";
import { DeleteIcon, PlusIcon } from "lucide-react";
import { MdDeleteForever } from "react-icons/md";

export interface MedicationTypeProp {
    category: string;
    strength: string;
    value: number | null;
    presentation: string;
    package: string
}

type MedicationVariation = {
    id?: number; //to handle item already existing on the database during edit/update
    presentation: string;
    measurement: string;
    strength_value: number;
    package: string;
    weight: number;
}

type SelectedOption = {
    label: string;
    value: string;
}

interface IFormInput {
    name: string;
    status: string;
    active: boolean;
    variations?: MedicationVariation[];
}

const defaultFormValue: IFormInput = {
    name: "",
    status: "",
    active: false,
    variations: [{
        presentation: null, //e.g Syrup
        strength_value: null, // e.g 1000
        measurement: null, // e.g MG
        package: null, // e.g 1x100 sachet
        weight: null, // optional e.g 100KG
    }]
}

const AddMedicationType = (
    { isOpen, onClose, fetchingMedicationTypes }:
        { isOpen: boolean; onClose: () => void; fetchingMedicationTypes: () => void; }
) => {

    const session = useSession();
    const sessionToken = session?.data as NextAuthUserSession;
    const token = sessionToken?.user?.token;
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
        setValue,
        watch,
        control,
        trigger,
    } = useForm<IFormInput>({
        mode: "onChange",
        defaultValues: defaultFormValue,
    });

    const {
        fields: variations,
        remove: removeVariant,
        append: addVariant,
    } = useFieldArray({
        control,
        name: "variations",
    });

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setIsLoading(true)
        try {
            const response = await requestClient({ token: token }).post(
                "/admin/settings/medication-types",
                data
            )
            if (response.status === 200) {
                setIsLoading(false);
                fetchingMedicationTypes();
                onClose();
            }
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            toast.error(handleServerErrorMessage(error));
        }
    };

    // todo: fetch existing presentation list from backend and set the hardcode list to empty array []
    const [presentationList, setPresentationList] = useState<SelectedOption[]>([
        { label: "Sachet", value: "Sachet" },
        { label: "Bottle", value: "Bottle" },
        { label: "Capsule", value: "Capsule" },
    ]);

    // todo: fetch existing measurements list from backend and set the hardcode list to empty array []
    const [measurementList, setMeasurementList] = useState<SelectedOption[]>([
        { label: "MG", value: "MG" },
        { label: "ML", value: "ML" },
        { label: "Ug", value: "Ug" },
    ]);

    useEffect(() => {
        // TODO: implement fetch dropdowns i.e presentations and measurements list
        //GET /admin/settings/measurements,
        //GET /admin/settings/presentations,
        
    }, [])

    return (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"xl"}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader className="capitalize">Add Medication Type</DrawerHeader>
                <DrawerBody>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl isInvalid={!!errors.name?.message}>
                            <FormLabel>Name</FormLabel>
                            <Input
                                type={"text"}
                                placeholder=""
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
                                {...register("status", {
                                    required: "Status is required",
                                })}
                                placeholder="select status">
                                <option value="APPROVED">Approved</option>
                                <option value="PENDING">Pending</option>
                            </Select>
                            {errors.status && (
                                <Text as={"span"} className="text-red-500 text-sm">
                                    {errors.status?.message}
                                </Text>
                            )}
                        </FormControl>
                        <FormControl mt={5} display='flex' gap={2} alignItems='center'>
                            <Switch
                                defaultChecked={watch('active')}
                                checked={watch('active')}
                                onChange={(e) =>
                                    setValue(
                                        "active",
                                        e.target.checked
                                    )
                                }
                            />
                            <FormLabel htmlFor='active' mb='0'>
                                Active
                            </FormLabel>
                        </FormControl>
                        <TableContainer mt={5}>
                            <Table variant='simple' border={"1px solid #EAECF0"} rounded={"md"}>
                                <Thead bg={"#E8F1F8"}>
                                    <Tr color={"primary.500"} roundedTop={"md"}>
                                        <Th px={2}>Variant</Th>
                                        <Th px={2}>Strength Value</Th>
                                        <Th px={2}>Unit of Measure</Th>
                                        <Th px={2}>Package Per Roll</Th>
                                        <Th px={2}>Weight (Kg)</Th>
                                        <Th px={2}></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        variations.map((variation, index) => (
                                            <Tr key={index}>
                                                <Td fontSize={"14px"} width={'20%'} px={2}>
                                                    <Controller
                                                        control={control}
                                                        name={`variations.${index}.presentation`}
                                                        rules={{ required: 'Presentation is required' }}
                                                        render={({ field: { onChange } }) => 
                                                            <div className="flex flex-col">
                                                                <CustomCreatableSelectComponent
                                                                    name={`variations.${index}.presentation`}
                                                                    placeholder={'Select...'}
                                                                    options={presentationList}
                                                                    onOptionSelected={(selectedOption: CreatableSelectOption) => {
                                                                        onChange(selectedOption?.value);
                                                                    }}
                                                                />
                                                               {errors.variations?.[index]?.presentation?.message &&
                                                                    <Text as={"span"} className="text-red-500 text-sm">
                                                                        {errors.variations?.[index]?.presentation?.message}
                                                                    </Text>
                                                                }
                                                            </div>
                                                        }
                                                    />
                                                </Td>
                                                <Td fontSize={"14px"} width={'20%'} px={2}>
                                                    <div className="flex flex-col">
                                                        <Input
                                                            {...register(`variations.${index}.strength_value`, {
                                                                required: "Strength is required",
                                                            })}
                                                            placeholder="e.g 100"
                                                            type="number"
                                                        />
                                                        {errors.variations?.[index]?.strength_value?.message &&
                                                            <Text as={"span"} className="text-red-500 text-sm">
                                                                {errors.variations?.[index]?.strength_value?.message}
                                                            </Text>
                                                        }
                                                    </div>
                                                </Td>
                                                <Td fontSize={"14px"} width={'20%'} px={2}>
                                                    <Controller
                                                        control={control}
                                                        name={`variations.${index}.measurement`}
                                                        rules={{ required: 'Measurement is required' }}
                                                        render={({ field: { onChange } }) =>
                                                            <div className="flex flex-col">

                                                            <CustomCreatableSelectComponent
                                                                name={`variations.${index}.measurement`}
                                                                placeholder={'Select...'}
                                                                options={measurementList}
                                                                onOptionSelected={(selectedOption: CreatableSelectOption) => {
                                                                    onChange(selectedOption?.value);
                                                                }}
                                                            />
                                                            {errors.variations?.[index]?.measurement?.message &&
                                                                <Text as={"span"} className="text-red-500 text-sm">
                                                                        {errors.variations?.[index]?.measurement?.message}
                                                                </Text>
                                                            }
                                                            </div>
                                                        }
                                                    />
                                                </Td>
                                                <Td fontSize={"14px"} width={'20%'} px={2}>
                                                    <div className="flex flex-col">
                                                        <Input
                                                            {...register(`variations.${index}.package`, {
                                                                required: "Package is required",
                                                            })}
                                                            placeholder="e.g 1x100 Pieces"
                                                            type="text"
                                                        />
                                                        {errors.variations?.[index]?.package?.message &&
                                                            <Text as={"span"} className="text-red-500 text-sm">
                                                                {errors.variations?.[index]?.package?.message}
                                                            </Text>
                                                        }
                                                    </div>
                                                </Td>
                                                <Td fontSize={"14px"} width={'20%'} px={2}>
                                                    <div className="flex flex-col">
                                                        <Input
                                                            {...register(`variations.${index}.weight`)}
                                                            placeholder="e.g 100"
                                                            type="number"
                                                        />
                                                        <Text></Text>
                                                    </div>
                                                </Td>
                                                <Td fontSize={"14px"} width={'20%'} px={2}>
                                                    {index !== 0 &&
                                                        <IconButton aria-label="Search database" className="!hover:bg-transpareng !bg-transparent"
                                                            onClick={() => {
                                                                removeVariant(index);
                                                            }}
                                                    >
                                                        <MdDeleteForever className="text-red-500 h-6 w-6" />
                                                    </IconButton>
                                                    }
                                                </Td>
                                            </Tr>
                                        ))
                                    }
                                </Tbody>
                            </Table>
                            <div className="my-5">
                                {/* add line item */}
                                <Button
                                    size={'sm'}
                                    type="button"
                                    variant={'outline'}
                                    loadingText="Submitting..."
                                    className="bg-primary-500 text-white p-3"
                                    onClick={async () => {
                                        const isValid = await trigger(['variations']);
                                        if (!isValid) return;
                                        addVariant(defaultFormValue.variations[0]);
                                    }}
                                >
                                    <PlusIcon className="text-bg-primary-500 h-6 w-6" />
                                    Add New Line
                                </Button>
                            </div>
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
                                    Add Medication Type
                                </Button>
                            </Flex>
                        </HStack>
                    </form>
                    <div className="my-5 flex justify-end">
                        <Image src={shape} alt="" />
                    </div>
                </DrawerBody>
                <DrawerFooter p={0}>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default AddMedicationType