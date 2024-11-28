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
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import shape from "@public/assets/images/Rectangle 43.svg";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";

interface IFormInput {
  name: string;
  status: string;
  isActive: string;
}

const AddNewBrands = (
  { isOpen, onClose, type, refetchingTypes }: 
  { isOpen: boolean; onClose: () => void; type: "Brand" | "Category", refetchingTypes: () => void;}
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
    reset
  } = useForm<IFormInput>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInput>  = async (data) => {
    console.log(data)
    setIsLoading(true)
    try {
      let response;
      if(type === "Brand"){
        response = await requestClient({token: token}).post(
          "/admin/settings/brands",
          data
        )
      }else if(type === "Category"){
        response = await requestClient({token: token}).post(
          "/admin/settings/categories",
          data
        )
      }
      console.log(response);
      if(response.status === 200){
        setIsLoading(false);
        refetchingTypes();
        reset();
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast.error(handleServerErrorMessage(error));
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"md"}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader className="capitalize">Add New {type}</DrawerHeader>
        <DrawerBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.name?.message}>
                <FormLabel>Name</FormLabel>
                <Input
                  type={"text"}
                  placeholder=""
                  {...register("name", {
                    required: "Current password is required",
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
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => <Switch {...field} />}
                />
                <FormLabel htmlFor='isActive' mb='0'>
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
                  Add New {type} 
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

export default AddNewBrands