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
    Text 
} from "@chakra-ui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import shape from "@public/assets/images/Rectangle 43.svg";
import { MedicationData, NextAuthUserSession } from "@/types";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import { useSession } from "next-auth/react";

interface IFormInput {
  name: string;
  status: string;
  active: boolean;
}

const EditBrands = (
  { isOpen, onClose, type, brand, refetchingTypes}: 
  { isOpen: boolean; onClose: () => void; type: "Brand" | "Category" | "Presentation" | "Measurement", brand: MedicationData, refetchingTypes: () => void}
) => {

  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;
  const [isLoading, setIsLoading] = useState(false);

  const {
      register,
      formState: { errors, isValid },
      handleSubmit,
      control,
    reset,
    setValue,
      watch,
  } = useForm<IFormInput>({
    mode: "onChange",
    defaultValues: {
      name: "",
      status: "",
      active: false,
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true)
    try {
        let response: any;
        if(type === "Brand"){
          response = await requestClient({token: token}).patch(
              `/admin/settings/brands/${brand?.id}`,
              data
          )
        }else if(type === "Category"){
          response = await requestClient({token: token}).patch(
            `/admin/settings/categories/${brand?.id}`,
            data
        )
        }
        if(response.status === 200){
            toast.success(response.data?.message);
            refetchingTypes();
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

  useEffect(() => {
    if (brand) {
      setValue("name", brand?.name);
      setValue("status", brand?.status);
      setValue("active", brand?.active);
    }
  }, [brand, setValue]);

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"md"}>
    <DrawerOverlay />
    <DrawerContent>
      <DrawerCloseButton />
      <DrawerHeader className="capitalize">Edit {type}</DrawerHeader>
      <DrawerBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={!!errors.name?.message}>
              <FormLabel>Name</FormLabel>
              <Input
                type={"text"}
                placeholder=""
                defaultValue={brand?.name}
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
              defaultValue={brand?.status}
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
          <HStack mt={5} justify={"end"}>
            <Flex gap={3}>
              <Button w={"120px"} onClick={onClose} variant={"outline"}>
                Cancel
              </Button>
              <Button
                w={"160px"}
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

export default EditBrands