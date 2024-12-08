import React from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Text,
  InputProps,
} from "@chakra-ui/react";

interface PhoneNumberInputProps extends InputProps {
  name: string;
  label: string;
  control: Control<any>;
  errors: FieldErrors<any>;
  isRequired?: boolean;
  placeholder?: string;
  validationRules?: Record<string, any>;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  name,
  label,
  control,
  errors,
  isRequired = false,
  placeholder,
  validationRules = {},
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: isRequired ? `${label} is required` : false,
        ...validationRules,
      }}
      render={({ field }) => (
        <FormControl isInvalid={!!errors[name]}>
          <FormLabel htmlFor={name}>
            {label}{" "}
            {isRequired && (
              <Text as="span" color="red.500">
                *
              </Text>
            )}
          </FormLabel>
          <Input
            {...field}
            id={name}
            placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              const sanitizedValue = value.replace(/[^0-9+]/g, "");
              field.onChange(sanitizedValue);
            }}
            {...rest}
          />
          <FormErrorMessage>
            {errors[name]?.message.toString()}
          </FormErrorMessage>
        </FormControl>
      )}
    />
  );
};

export default PhoneNumberInput;
