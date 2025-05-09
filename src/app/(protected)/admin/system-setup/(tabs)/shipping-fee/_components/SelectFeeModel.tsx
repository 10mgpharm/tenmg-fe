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
  shippingFeeType,
  setShippingFeeType,
  onClose,
}: {
  open: boolean;
  setIsOpen: () => void;
  onClose: () => void;
  setShippingFeeType: (value: "FLAT" | "CUSTOM") => void;
  shippingFeeType: "FLAT" | "CUSTOM";
}) => {
  const [formStep, setFormStep] = useState(1);

  const { value, getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: shippingFeeType,
    onChange: () => {},
  });

  return (
    <Drawer isOpen={open} placement="right" onClose={setIsOpen} size={"sm"}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {shippingFeeType === "FLAT" ? (
            <div>
              <h2 className="text-[20px] font-semibold">Flat Shipping Fee</h2>
              <p className="text-[15px] font-[400] ">
                Setup your flat shipping fee.
              </p>
            </div>
          ) : shippingFeeType === "CUSTOM" ? (
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
                    setShippingFeeType(value as "FLAT" | "CUSTOM");
                  }}
                >
                  Continue
                </Button>
              </Stack>
            </div>
          ) : (
            <div>
              {shippingFeeType === "FLAT" ? (
                <FlatFeeForm onClose={onClose} setFormStep={setFormStep} />
              ) : (
                <CustomFeeForm onClose={onClose} setFormStep={setFormStep} />
              )}
            </div>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SelectFeeModel;
