import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  HStack,
  VStack,
  Input,
  IconButton,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { IoTrashOutline } from "react-icons/io5";

interface AffordabilityModelProps {
  isOpen: boolean;
  onClose: () => void;
  reloadCustomers?: () => void; // Function to reload customer data in the parent component
}

interface FormValues {
  criteria: {
    lowerBound: string;
    upperBound: string;
    minAmount: string;
    maxAmount: string;
  }[];
}

const AffordabilityModel = ({
  isOpen,
  onClose,
  reloadCustomers,
}: AffordabilityModelProps) => {
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      criteria: [
        {
          lowerBound: "",
          upperBound: "",
          minAmount: "",
          maxAmount: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "criteria",
  });

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Submitted Data:", data);
      toast.success("Affordability criteria saved successfully.");
      if (reloadCustomers) reloadCustomers();
      reset();
      onClose();
    } catch (error) {
      toast.error("Failed to save affordability criteria.");
    }
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader pb={8}>
          <Flex justifyContent={"space-between"}>
            <Stack gap={3} w="60%">
              <Text fontSize="2xl" fontWeight="medium">
                Affordability Criteria
              </Text>
              <Text fontSize="sm" fontWeight="normal">
                These are system identifiers that are used to evaluate
                e-commerce transaction history to compute a credit score with
                the set affordability criteria.
              </Text>
            </Stack>
            <Flex gap={4} alignItems={"flex-end"}>
              <Button
                onClick={onClose}
                rounded="lg"
                variant={"outline"}
                color={"gray.500"}
                borderColor={"gray.300"}
                px={3}
                py={2}
              >
                Cancel
              </Button>

              <Button
                form="affordability-form"
                type="submit"
                rounded="lg"
                px={3}
                py={2}
                isLoading={isSubmitting}
              >
                Save Changes
              </Button>
            </Flex>
          </Flex>
        </ModalHeader>

        <ModalBody pb={10}>
          <form id="affordability-form" onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={5} align="stretch">
              {/* Form Header */}
              <HStack spacing={4}>
                <Text flex="1">Lower bound</Text>
                <Text flex="1">Upper bound</Text>
                <Text flex="1">Min. Amount</Text>
                <Text flex="1">Max. Amount</Text>
                <Box w="40px"></Box> {/* Placeholder for delete button */}
              </HStack>

              {/* Form Rows */}
              {fields.map((field, index) => (
                <HStack spacing={4} key={field.id}>
                  {/* Lower Bound */}
                  <FormControl
                    isInvalid={!!errors.criteria?.[index]?.upperBound}
                    flex="1"
                  >
                    <Controller
                      control={control}
                      name={`criteria.${index}.lowerBound`}
                      rules={{ required: "Lower bound is required" }}
                      render={({ field }) => (
                        <Input {...field} placeholder="Lower bound" />
                      )}
                    />
                    <FormErrorMessage>
                      {errors.criteria?.[index]?.lowerBound?.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Upper Bound */}
                  <FormControl
                    isInvalid={!!errors.criteria?.[index]?.upperBound}
                    flex="1"
                  >
                    <Controller
                      control={control}
                      name={`criteria.${index}.upperBound`}
                      rules={{ required: "Upper bound is required" }}
                      render={({ field }) => (
                        <Input {...field} placeholder="Upper bound" />
                      )}
                    />
                    <FormErrorMessage>
                      {errors.criteria?.[index]?.upperBound?.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Min Amount */}
                  <FormControl
                    isInvalid={!!errors.criteria?.[index]?.minAmount}
                    flex="1"
                  >
                    <Controller
                      control={control}
                      name={`criteria.${index}.minAmount`}
                      rules={{ required: "Min. Amount is required" }}
                      render={({ field }) => (
                        <InputGroup>
                          <InputLeftElement
                            pointerEvents="none"
                            color="gray.500"
                            gap={0}
                          >
                            ₦
                          </InputLeftElement>
                          <Input
                            {...field}
                            placeholder="Min. Amount"
                            type="number"
                          />
                        </InputGroup>
                      )}
                    />
                    <FormErrorMessage>
                      {errors.criteria?.[index]?.minAmount?.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Max Amount */}
                  <FormControl
                    isInvalid={!!errors.criteria?.[index]?.maxAmount}
                    flex="1"
                  >
                    <Controller
                      control={control}
                      name={`criteria.${index}.maxAmount`}
                      rules={{ required: "Max. Amount is required" }}
                      render={({ field }) => (
                        <InputGroup>
                          <InputLeftElement
                            pointerEvents="none"
                            color="gray.500"
                          >
                            ₦
                          </InputLeftElement>
                          <Input
                            {...field}
                            placeholder="Max. Amount"
                            type="number"
                          />
                        </InputGroup>
                      )}
                    />
                    <FormErrorMessage>
                      {errors.criteria?.[index]?.maxAmount?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <IconButton
                    aria-label="Delete row"
                    icon={<IoTrashOutline />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => remove(index)}
                  />
                </HStack>
              ))}

              {/* Add New Row Button */}
              <Button
                onClick={() =>
                  append({
                    lowerBound: "",
                    upperBound: "",
                    minAmount: "",
                    maxAmount: "",
                  })
                }
                alignSelf="center"
                bg="primary.50"
                border="none"
                rounded="lg"
                colorScheme="primary"
                variant="outline"
              >
                Add Another
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AffordabilityModel;
