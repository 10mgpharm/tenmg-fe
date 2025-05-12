import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { CustomFeeForm } from "./customeFeeAmount";
import { ShippingFeeDataType } from "../page";

const AddNewFee = ({
  open,
  setIsOpen,
  setShippingFeeData,
  shippingFeeData,
  onClose,
}: {
  open: boolean;
  setIsOpen: () => void;
  onClose: () => void;
  setShippingFeeData: (value: ShippingFeeDataType) => void;
  shippingFeeData: ShippingFeeDataType;
}) => {
  return (
    <Drawer isOpen={open} placement="right" onClose={setIsOpen} size={"sm"}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <h2 className="text-[20px] font-semibold">Custom Shipping Fee</h2>
          <p className="text-[15px] font-[400] ">
            Setup your custom shipping fee.
          </p>
        </DrawerHeader>
        <DrawerBody>
          <CustomFeeForm
            isAdding
            onClose={onClose}
            setShippingFeeData={setShippingFeeData}
            shippingFeeData={shippingFeeData}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default AddNewFee;
