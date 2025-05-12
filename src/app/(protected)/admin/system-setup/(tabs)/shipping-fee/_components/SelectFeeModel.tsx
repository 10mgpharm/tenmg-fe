import { CustomRadio } from "@/app/(protected)/lenders/_components/CustomeRadioInput";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Stack,
  useRadioGroup,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FlatFeeForm } from "./flatFeeForm";
import { CustomFeeForm } from "./customeFeeAmount";
import { ShippingFeeDataType } from "../page";

const items = [
  {
    header: "Flat Shipping Fee ",
    description:
      "Set a single fixed shipping price for all orders, no matter the location.",
    value: "FLAT",
  },
  {
    header: "Custom Shipping Fee ",
    description:
      "Define shipping prices based on location, region, or delivery zone",
    value: "CUSTOM",
  },
];

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
  const [formStep, setFormStep] = useState(1);
  const [selectedShippingFeeType, setSelectedShippingFeeType] = useState<
    "FLAT" | "CUSTOM"
  >(shippingFeeData.type);

  const { value, getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: shippingFeeData.type,
    onChange: () => {},
  });

  return (
    <Drawer isOpen={open} placement="right" onClose={setIsOpen} size={"sm"}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {selectedShippingFeeType === "FLAT" ? (
            <div>
              <h2 className="text-[20px] font-semibold">Flat Shipping Fee</h2>
              <p className="text-[15px] font-[400] ">
                Setup your flat shipping fee.
              </p>
            </div>
          ) : selectedShippingFeeType === "CUSTOM" ? (
            <div>
              {" "}
              <h2 className="text-[20px] font-semibold">Custom Shipping Fee</h2>
              <p className="text-[15px] font-[400] ">
                Setup your custom shipping fee.
              </p>
            </div>
          ) : (
            <div>
              {" "}
              <h2 className="text-[20px] font-semibold">
                Choose Your Shipping Fee Type
              </h2>
              <p className="text-[15px] font-[400] ">
                Choose a shipping fee type that best suits your business.
              </p>
            </div>
          )}
        </DrawerHeader>
        <DrawerBody>
          {formStep === 1 ? (
            <div>
              <Stack {...getRootProps()}>
                <Flex direction={"column"} gap={4}>
                  {items.map((i, key) => (
                    <CustomRadio
                      key={key}
                      {...i}
                      {...getRadioProps({ value: i.value })}
                    />
                  ))}
                </Flex>

                <Button
                  className="mt-4"
                  onClick={() => {
                    setFormStep(2);
                    setSelectedShippingFeeType(value as "FLAT" | "CUSTOM");
                  }}
                >
                  Continue
                </Button>
              </Stack>
            </div>
          ) : (
            <div>
              {selectedShippingFeeType === "FLAT" ? (
                <FlatFeeForm
                  onClose={onClose}
                  setFormStep={setFormStep}
                  setShippingFeeData={setShippingFeeData}
                  shippingFeeData={shippingFeeData}
                />
              ) : (
                <CustomFeeForm
                  onClose={onClose}
                  setFormStep={setFormStep}
                  setShippingFeeData={setShippingFeeData}
                  shippingFeeData={shippingFeeData}
                />
              )}
            </div>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SelectFeeModel;
