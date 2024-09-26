import avatar from "@public/assets/images/Avatar.svg";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Textarea,
} from "@chakra-ui/react";
import Image from "next/image";

const PersonalInformation = () => {
  return (
    <>
      <Divider mb={5} border="1px solid gray.200" />
      <div className="p-5 rounded-md bg-white max-w-5xl">
        <form className="space-y-5 mt-5 mb-8">
          <HStack gap={5}>
            <FormControl>
              <FormLabel>Business Name</FormLabel>
              <Input placeholder="Enter business name" />
            </FormControl>
            <FormControl>
              <FormLabel>Contact Person&apos;s Name</FormLabel>
              <Input placeholder="Enter contact name" />
            </FormControl>
          </HStack>
          <HStack gap={5}>
            <FormControl>
              <FormLabel>Business Email</FormLabel>
              <Input type="email" placeholder="Enter contact name" />
            </FormControl>
            <FormControl>
              <FormLabel>Contact Phone Number</FormLabel>
              <Input type="number" placeholder="Enter phone number" />
            </FormControl>
          </HStack>
          <HStack gap={5}>
            <FormControl>
              <FormLabel>Business Address</FormLabel>
              <Textarea placeholder="Enter here" />
            </FormControl>
            <FormControl>
              <FormLabel>Position</FormLabel>
              <Textarea placeholder="Enter here" />
            </FormControl>
          </HStack>
          <HStack justify={"center"}>
            <Flex>
              <Button variant="outline" mr={3}>
                Cancel
              </Button>
              <Button colorScheme="blue">Save Changes</Button>
            </Flex>
          </HStack>
        </form>
      </div>
    </>
  );
};

export default PersonalInformation;
