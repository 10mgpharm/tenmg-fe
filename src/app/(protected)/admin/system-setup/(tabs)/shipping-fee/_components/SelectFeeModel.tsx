import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import React from "react";
import { ShippingFeeDataType } from "../page";

// const items = [
//   {
//     header: "Flat Shipping Fee ",
//     description:
//       "Set a single fixed shipping price for all orders, no matter the location.",
//     value: "FLAT",
//   },
//   {
//     header: "Custom Shipping Fee ",
//     description:
//       "Define shipping prices based on location, region, or delivery zone.",
//     value: "CUSTOM",
//   },
// ];

const SelectFeeModel = ({
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
    <Drawer isOpen={open} placement="right" onClose={onClose} size={"sm"}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Config shipping fee modal</DrawerHeader>
        <DrawerBody>Body</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SelectFeeModel;
