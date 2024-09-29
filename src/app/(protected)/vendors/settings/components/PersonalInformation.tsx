import avatar from "@public/assets/images/Avatar.svg";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
} from "@chakra-ui/react";
import Image from "next/image";
import { MdOutlineEmail } from "react-icons/md";

const PersonalInformation = () => {
  return (
    <>
      <Divider mb={[2, 5]} border="1px solid gray.200" />
      <div className="p-2 md:p-5 rounded-md bg-white md:max-w-5xl">
        <form className="space-y-5 mt-2 md:mt-5 mb-3 md:mb-8">
          <HStack gap={5} flexDirection={{ base: "column", md: "row" }}>
            <FormControl>
              <FormLabel fontSize={"sm"} fontWeight={"medium"}>
                Business Name
              </FormLabel>
              <Input placeholder="Enter business name" />
            </FormControl>
            <FormControl>
              <FormLabel fontSize={"sm"} fontWeight={"medium"}>
                Contact Person&apos;s Name
              </FormLabel>
              <Input placeholder="Enter contact name" />
            </FormControl>
          </HStack>
          <HStack gap={5} flexDirection={{ base: "column", md: "row" }}>
            <FormControl>
              <FormLabel fontSize={"sm"} fontWeight={"medium"}>
                Business Email
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none" fontSize="1.2em">
                  <MdOutlineEmail color="gray.300" />
                </InputLeftElement>
                <Input
                  type="email"
                  placeholder="Enter business email"
                  pl={10}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel fontSize={"sm"} fontWeight={"medium"}>
                Contact Phone Number
              </FormLabel>
              <Input type="number" placeholder="Enter phone number" />
            </FormControl>
          </HStack>
          <HStack gap={5} flexDirection={{ base: "column", md: "row" }}>
            <FormControl>
              <FormLabel fontSize={"sm"} fontWeight={"medium"}>
                Business Address
              </FormLabel>
              <Textarea placeholder="Enter here" />
            </FormControl>
            <FormControl>
              <FormLabel fontSize={"sm"} fontWeight={"medium"}>
                Position
              </FormLabel>
              <Textarea placeholder="Enter here" />
            </FormControl>
          </HStack>
          <HStack
            justify={"center"}
            pt={16}
            flexDirection={{ base: "column", md: "row" }}
          >
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
