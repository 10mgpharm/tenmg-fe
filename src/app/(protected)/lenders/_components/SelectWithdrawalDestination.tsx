import { Button, Flex, Stack, useRadioGroup } from "@chakra-ui/react";
import { CustomRadio } from "./CustomeRadioInput";

const items = [
  {
    header: "Withdraw to Bank Account",
    description:
      "Send funds from your Investment Wallet directly to your saved bank account.",
    value: "EXTERNAL",
  },
  {
    header: "Transfer to Main Wallet",
    description: "Move funds from your Investment Wallet to your Main Wallet",
    value: "INTERNAL",
  },
];

const SelectWithdrawalDestination = ({
  withdrawalType,
  setWithdrawalType,
  setFormStep,
}: {
  withdrawalType: "EXTERNAL" | "INTERNAL";
  setWithdrawalType: (value: "EXTERNAL" | "INTERNAL") => void;
  setFormStep: (value: number) => void;
}) => {
  const { value, getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: withdrawalType,
    onChange: () => {},
  });

  return (
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
            setWithdrawalType(value as "EXTERNAL" | "INTERNAL");
          }}
        >
          Continue
        </Button>
      </Stack>
    </div>
  );
};

export default SelectWithdrawalDestination;
