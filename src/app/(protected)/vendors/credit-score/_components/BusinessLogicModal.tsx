import {
  Box,
  Button,
  Flex,
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
  Select,
  Divider,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";

interface BusinessLogicCriteriaProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Criterion {
  condition: string;
  compareValue: string;
  ifApplicable: string;
  score: string;
}

interface FormValues {
  creditPattern: Criterion[];
  purchasePattern: Criterion[];
}

const BusinessLogicCriteria = ({ isOpen, onClose }: BusinessLogicCriteriaProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      creditPattern: [{ condition: "", compareValue: "", ifApplicable: "Yes", score: "" }],
      purchasePattern: [{ condition: "", compareValue: "", ifApplicable: "Yes", score: "" }],
    },
  });

  const { fields: creditPatternFields, append: appendCreditPattern, remove: removeCreditPattern } = useFieldArray({
    control,
    name: "creditPattern",
  });

  const { fields: purchasePatternFields, append: appendPurchasePattern, remove: removePurchasePattern } = useFieldArray({
    control,
    name: "purchasePattern",
  });

  const onSubmit = () => {
    reset();
    onClose();
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader pb={8}>
          <Flex justifyContent="space-between">
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
            <Flex gap={4} alignItems="flex-end">
              <Button onClick={onClose} rounded="lg" variant="outline" color="gray.500" borderColor="gray.300" px={3} py={2}>
                Cancel
              </Button>
              <Button form="criteria-form" type="submit" rounded="lg" px={3} py={2} isLoading={isSubmitting}>
                Save Changes
              </Button>
            </Flex>
          </Flex>
        </ModalHeader>
        <ModalBody pb={10}>
          <form id="criteria-form" onSubmit={handleSubmit(onSubmit)}>
            <Tabs variant="unstyled">
              <TabList overflow="auto">
                <Tab _selected={{ color: "blue.500", bg: "blue.50", borderRadius: "md" }}>Credit Pattern</Tab>
                <Tab _selected={{ color: "blue.500", bg: "blue.50", borderRadius: "md" }}>Purchase Pattern</Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0}>
                  
                </TabPanel>
                <TabPanel px={0}>
                  
                </TabPanel>
              </TabPanels>
            </Tabs>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BusinessLogicCriteria;

