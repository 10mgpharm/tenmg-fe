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
  walletType,
}: {
  isOpen: boolean;
  onClose: () => void;
  walletType: "product_wallet" | "loan_wallet";
}) => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"md"}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader className="capitalize">Initiate Payout</DrawerHeader>
        <DrawerBody>
          <form>
            <FormControl>
              <FormLabel>
                {walletType === "product_wallet"
                  ? "Supplier Name"
                  : "Vendor Name"}
              </FormLabel>
              <Input value={"Chidi Victor Fubara"} />
            </FormControl>
            <FormControl mt={5}>
              <FormLabel>Amount</FormLabel>
              <Input value={"#89000"} />
            </FormControl>
            <HStack mt={5} justify={"end"}>
              <Flex gap={3}>
                <Button w={"120px"} onClick={onClose} variant={"outline"}>
                  Discard
                </Button>
                <Button w={"120px"} className="bg-primary-500 text-white">
                  Pay {walletType === "product_wallet" ? "Supplier" : "Vendor"}
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
