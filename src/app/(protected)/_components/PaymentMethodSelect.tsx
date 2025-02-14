import React from "react";
import Select, { OptionProps, SingleValue, StylesConfig } from "react-select";
import { 
  Box, 
  Flex, 
  Text, 
  useColorModeValue 
} from "@chakra-ui/react";

// Type for your payment option
type PaymentOption = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

// Example: custom React component for each Option
const CustomOption: React.FC<OptionProps<PaymentOption, false>> = (props) => {
  const { data, innerProps, innerRef, isFocused, isSelected } = props;
  
  return (
    <Flex
      ref={innerRef}
      {...innerProps}
      align="center"
      justify="space-between"
      bg={isFocused ? "gray.100" : "white"}
      p={3}
      cursor="pointer"
      borderLeft={isSelected ? "4px solid #3182CE" : "4px solid transparent"}
    >
      <Text>{data.label}</Text>
      {data.icon && <Box ml={2}>{data.icon}</Box>}
    </Flex>
  );
};

type Props = {
  options: PaymentOption[];
  value: PaymentOption | null;
  onChange: (option: SingleValue<PaymentOption>) => void;
};

export function PaymentMethodSelect({ options, value, onChange }: Props) {
  // Access Chakra’s color tokens
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBorderColor = useColorModeValue("gray.300", "gray.500");

  // Define react-select style overrides
  const customStyles: StylesConfig<PaymentOption, false> = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? hoverBorderColor : borderColor,
      borderWidth: "1px",
      boxShadow: "none",
      "&:hover": {
        borderColor: hoverBorderColor,
      },
      padding: "2px",
      // You may want to set a fixed height, backgroundColor, etc.
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // ensure it's on top if needed
    }),
  };

  return (
    <Select<PaymentOption>
      options={options}
      value={value}
      onChange={onChange}
      // Provide your custom Option component
      components={{
        Option: CustomOption,
      }}
      styles={customStyles}
      // This hides the text search box if you want a simpler dropdown
      isSearchable={false}
    />
  );
}
