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
import { useForm } from "react-hook-form";
import shape from "@public/assets/images/Rectangle 43.svg";

interface IFormInput {
    name: string;
    status: string;
    createdBy: string;
}

const EditBrands = ({ isOpen, onClose, type}: { isOpen: boolean; onClose: () => void; type: "Brand" | "Category"}) => {

    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
    } = useForm<IFormInput>({
        mode: "onChange",
        defaultValues: {
            name: "",
            status: "",
            createdBy: "",
        },
    });

    const onSubmit = async () => {};

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
            <Select>
              <option value="">Published</option>
              <option value="">Draft</option>
              <option value="">Pending Review</option>
            </Select>
            {errors.status && (
              <Text as={"span"} className="text-red-500 text-sm">
                {errors.status?.message}
              </Text>
            )}
          </FormControl>
          <FormControl mt={5} isInvalid={!!errors.createdBy?.message}>
            <FormLabel>Created By</FormLabel>
            <Input
                type={"text"}
                placeholder=""
                {...register("createdBy", {
                  required: "Createdby is required",
                })}
              />
            {errors.createdBy && (
              <Text as={"span"} className="text-red-500 text-sm">
                {errors.createdBy?.message}
              </Text>
            )}
          </FormControl>
          <FormControl mt={5} display='flex' gap={2} alignItems='center'>
              <Switch id='email-alerts' />
              <FormLabel htmlFor='email-alerts' mb='0'>
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