import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Button,
} from "@chakra-ui/react";

import shape from "@public/assets/images/Rectangle 43.svg";
import Image from "next/image";

const InitiatePayout = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const handleAction = (actionType: "Discard" | "Pay") => {
    if (actionType === "Discard") {
      // write action fn

      onClose();
      return;
    }

    if (actionType === "Pay") {
      // write action fn

      onClose();
      return;
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"md"}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader className="capitalize">Initiate Payout</DrawerHeader>
        <DrawerBody>
          <form>
            <FormControl>
              <FormLabel>Vendor Name</FormLabel>
              <Input value={"Chidi Victor Fubara"} />
            </FormControl>
            <FormControl mt={5}>
              <FormLabel>Amount</FormLabel>
              <Input value={"#89000"} />
            </FormControl>
            <HStack mt={5} justify={"end"}>
              <Flex gap={3}>
                <Button
                  w={"120px"}
                  onClick={() => handleAction("Discard")}
                  variant={"outline"}
                >
                  Discard
                </Button>
                <Button
                  w={"120px"}
                  className="bg-primary-500 text-white"
                  onClick={() => handleAction("Pay")}
                >
                  Pay Vendor
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
  );
};

export default InitiatePayout;
