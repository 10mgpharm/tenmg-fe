
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
import { MedicationData, MedicationVariant, NextAuthUserSession } from "@/types";
import { handleServerErrorMessage } from "@/utils";
import { toast } from "react-toastify";
import CustomCreatableSelectComponent, { CreatableSelectOption } from "@/app/(protected)/_components/CustomCreatableSelect";
import { PlusIcon } from "lucide-react";
import { MdDeleteForever } from "react-icons/md";

export interface MedicationTypeProp {
    isOpen: boolean;
    onClose: () => void;
    medication: MedicationData;
    fetchingMedicationTypes: () => void;
    resetSelectedItem: () => void;
}

type MedicationVariation = {
    id?: number; //to handle item already existing on the database during edit/update
    presentation: string;
    measurement: string;
    strength_value: string;
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
    { medication, isOpen, onClose, resetSelectedItem, fetchingMedicationTypes }
    : MedicationTypeProp) => {

    const session = useSession();
    const sessionToken = session?.data as NextAuthUserSession;
    const token = sessionToken?.user?.token;
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
        watch,
        control,
        trigger,
        reset,
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
            const response = await requestClient({ token: token })[!medication ? 'post' : 'patch']
                (!medication ?
                    "/admin/settings/medication-types" : `/admin/settings/medication-types/${medication?.id}`,
                    data
                )

            if (response.status === 200) {
                reset(defaultFormValue);
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

    const [presentationList, setPresentationList] = useState<SelectedOption[]>(null);
    const [measurementList, setMeasurementList] = useState<SelectedOption[]>(null);

    const fetchPresentations = async () => {
        try {
            const response = await requestClient({ token: token })
                .get("/admin/settings/presentations/dropdown");

            if (response.status === 200) {
                const data = response.data.data;
                const mappedData = data?.map((item: any) => {
                    return {
                        label: item.name,
                        value: item.name
                    }
                })
                setPresentationList(mappedData)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchMeasurements = async () => {
        try {
            const response = await requestClient({ token: token })
                .get("/admin/settings/measurements/dropdown");

            if (response.status === 200) {
                const data = response.data.data;
                const mappedData = data?.map((item: any) => {
                    return {
                        label: item.name,
                        value: item.name
                    }
                })
                setMeasurementList(mappedData)
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (isOpen) {
            fetchPresentations();
            fetchMeasurements();
        }
    }, [isOpen, token]);

    //EDIT MODE: if selectedItem exist
    useEffect(() => {
        if (medication) {
            setValue("name", medication.name);
            setValue("status", medication.status);
            setValue("active", medication.active);
            setValue("variations", medication?.variations?.map((item: MedicationVariant) => {
                return {
                    id: item.id,
                    presentation: item.presentation,
                    strength_value: item.strengthValue,
                    measurement: item.measurement,
                    package: item.packagePerRoll,
                    weight: Number(item.weight),
                }
            }));
        }
    }, [medication, setValue]);

    const resetForm = () => {
        reset(defaultFormValue);
        onClose();
        resetSelectedItem();
    }

    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={resetForm}
            size={"xl"}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader className="capitalize">
                    {!medication ? `Add Medication Type` : `Edit Medication Type`}
                </DrawerHeader>
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
                                        presentationList &&
                                        measurementList &&
                                        variations.map((variation, index) => (
                                            <Tr key={index}>
                                                <Td fontSize={"14px"} width={'20%'} px={2}>
                                                    <Controller
                                                        control={control}
                                                        name={`variations.${index}.presentation`}
                                                        rules={{ required: 'Variant is required' }}
                                                        render={({ field: { onChange, value } }) =>
                                                            <div className="flex flex-col">
                                                                <CustomCreatableSelectComponent
                                                                    value={value}
                                                                    name={`variations.${index}.presentation`}
                                                                    placeholder={'Select...'}
                                                                    options={presentationList ?? []}
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
                                                                // validate value can either be number only e.g 90 or number with sepearor between 90/80
                                                                validate: (value) => {
                                                                    const regex = /^[0-9]+(\/[0-9]+)?$/;
                                                                    return regex.test(value) || "Strength is invalid";
                                                                }
                                                            })}
                                                            placeholder="e.g 100"
                                                            type="text"
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
                                                        render={({ field: { onChange, value } }) =>
                                                            <div className="flex flex-col">
                                                                <CustomCreatableSelectComponent
                                                                    value={value}
                                                                    name={`variations.${index}.measurement`}
                                                                    placeholder={'Select...'}
                                                                    options={measurementList ?? []}
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
                                                            placeholder="e.g 1*100 Pieces"
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
                                <Button w={"120px"} onClick={resetForm} variant={"outline"}>
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
                                    {!medication ? `Add Medication Type` : `Save Changes`}
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