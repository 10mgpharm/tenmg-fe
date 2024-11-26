import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";


interface BusinessLogicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  creditPattern: {
    condition: string;
    compareValue: string;
    isApplicable: string;
    score: string;
  }[];
}

const BusinessLogicModal = ({ isOpen, onClose }: BusinessLogicModalProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      creditPattern: [
        {
          condition: "LessThan",
          compareValue: "5",
          isApplicable: "Yes",
          score: "10",
        },
        {
          condition: "Greater Than Or Equal",
          compareValue: "₦5,000,000",
          isApplicable: "Yes",
          score: "25",
        },
        {
          condition: "Greater Than",
          compareValue: "₦200,000",
          isApplicable: "Yes",
          score: "30",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "creditPattern",
  });

  const onSubmit = async (data: FormValues) => {
    console.log("Submitted Data:", data);
    toast.success("Business Logic Criteria saved successfully!");
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader pb={8}>
          <Flex justifyContent={"space-between"}>
            <Stack gap={3} w="60%">
              <Text fontSize="2xl" fontWeight="medium">
                Business Logic Criteria
              </Text>
              <Text fontSize="sm" fontWeight="normal">
                These are system identifiers that are used to evaluate
                e-commerce transaction history to compute a credit score with
                the set business logic criteria.
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
          <Tabs variant={"unstyled"}>
            <TabList overflow={"auto"}>
              <Tab
                _selected={{
                  color: "primary.500",
                  bg: "primary.50",
                  borderRadius: "10px",
                }}
              >
                <div className="flex items-center gap-3">
                  <Text fontSize={{ base: "xs", md: "sm" }}>
                    Credit Pattern
                  </Text>
                </div>
              </Tab>
              <Tab
                _selected={{
                  color: "primary.500",
                  bg: "primary.50",
                  borderRadius: "10px",
                }}
              >
                <div className="flex items-center gap-3">
                  <Text fontSize={{ base: "xs", md: "sm" }}>
                    Purchase Pattern
                  </Text>
                </div>
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0}></TabPanel>
              <TabPanel></TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BusinessLogicModal;
