"use client";

import {
  Box,
  Text,
  Stack,
  useRadio,
  useRadioGroup,
  UseRadioProps,
  UseRadioGroupProps,
} from "@chakra-ui/react";
import { useState } from "react";

// 1. Custom radio box
export const CustomRadio = (
  props: UseRadioProps & { header: string; sub: string }
) => {
  const { getInputProps, getRadioProps, getLabelProps, state } =
    useRadio(props);
  const inputProps = getInputProps();
  const radioProps = getRadioProps();
  const labelProps = getLabelProps();

  return (
    <Box as="label" width="100%">
      <Box
        {...radioProps}
        borderWidth="2px"
        borderRadius="md"
        p={4}
        cursor="pointer"
        transition="all 0.2s"
        borderColor={state.isChecked ? "primary.500" : "gray.200"}
        bg={state.isChecked ? "primary.50" : "gray.50"}
        _hover={{ borderColor: "blue.500" }}
        className="flex  items-center"
      >
        <input
          {...inputProps}
          type="radio"
          style={{ marginRight: "12px" }}
          className="accent-primary-700"
        />

        {/* Text content */}
        <Box textAlign="left">
          <Text {...labelProps} fontWeight="bold" fontSize="md">
            {props.header}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {props.sub}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
