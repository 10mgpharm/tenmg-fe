import { 
    Box,
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
    Text,
    chakra
} from "@chakra-ui/react";
import Image from "next/image";
import shape from '@public/assets/images/Rectangle.svg';

const InviteMember = ({isOpen, onClose, accountType}: {isOpen: boolean, onClose: () => void, accountType?: "vendor"}) => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"md"}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader className="capitalize">Invite Member</DrawerHeader>
        <DrawerBody>
          <form>
            {/*  */}
            {accountType && (
              <FormControl mb={5}>
                <FormLabel>Full Name</FormLabel>
                <Input placeholder="" />
              </FormControl>
            )}
            <FormControl mb={5}>
              <FormLabel>Email Address</FormLabel>
              <Input placeholder="" />
            </FormControl>
            <FormControl mb={10}>
              <FormLabel>Roles</FormLabel>
              <Flex align={"center"} gap={10}>
                <Select flex={1}>
                  <option value="">Admin</option>
                  <option value="">Vendor</option>
                  <option value="">Supplier</option>
                </Select>
                <chakra.span className="text-primary-600 text-sm">
                  Hide Ride Details
                </chakra.span>
              </Flex>
            </FormControl>
            <Box p={4} rounded={"md"} bg={"gray.100"}>
              <Text fontWeight={500} fontSize={"15px"} mb={1}>
                Role&apos;s Permission
              </Text>
              <ul className="list-disc px-4 text-sm">
                <li>API Management: Create, Edit, Delete</li>
                <li>
                  User Management: Invite, Deactivate, Activate, Assign roles
                </li>
                <li>
                  Monitoring and Analytics: Generate Analytics, View API Usage
                  reports
                </li>
              </ul>
            </Box>
            <HStack maxW={"300px"} ml={"auto"} gap={3} mt={6}>
              <Button onClick={onClose} variant={"outline"}>
                Cancel
              </Button>
              <Button className="bg-primary-600 text-white w-[65%]">
                Invite Member
              </Button>
            </HStack>
          </form>
        </DrawerBody>
        <DrawerFooter p={0}>
          <Image src={shape} alt="" />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default InviteMember