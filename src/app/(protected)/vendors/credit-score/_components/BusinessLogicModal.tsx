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
import { IoTrashOutline } from "react-icons/io5";

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

  const onSubmit = (data: FormValues) => {
    console.log("Submitted Data:", data);
    reset();
    onClose();
  };

  const renderCriteriaFields = (fields, appendFn, removeFn, title, name) => (
    <form id="criteria-form" onSubmit={handleSubmit(onSubmit)}>
    <VStack spacing={4} align="stretch">
      {/* Table Headers */}
      <HStack spacing={4} fontWeight="bold">
        <Text flex="2">Condition</Text>
        <Text flex="2">Compare Value</Text>
        <Text flex="1">If Applicable</Text>
        <Text flex="1">Score</Text>
        <Box w="40px"></Box> {/* Placeholder for delete button */}
      </HStack>

      {/* Table Rows */}
      {fields.map((field, index) => (
        <HStack key={field.id} spacing={4}>
          {/* Condition */}
          <FormControl flex="2" isInvalid={!!errors.criteria?.[index]?.condition}>
            <Controller
              control={control}
              name={`criteria.${index}.condition`}
              rules={{ required: "Condition is required" }}
              render={({ field }) => (
                <Select {...field} placeholder="Select condition">
                  <option value="LessThan">Less Than</option>
                  <option value="GreaterThan">Greater Than</option>
                  <option value="GreaterThanOrEqual">
                    Greater Than Or Equal
                  </option>
                </Select>
              )}
            />
            <FormErrorMessage>
              {errors.criteria?.[index]?.condition?.message}
            </FormErrorMessage>
          </FormControl>

          {/* Compare Value */}
          <FormControl flex="2" isInvalid={!!errors.criteria?.[index]?.compareValue}>
            <Controller
              control={control}
              name={`criteria.${index}.compareValue`}
              rules={{ required: "Compare Value is required" }}
              render={({ field }) => (
                <Input {...field} placeholder="Enter value" />
              )}
            />
            <FormErrorMessage>
              {errors.criteria?.[index]?.compareValue?.message}
            </FormErrorMessage>
          </FormControl>

          {/* If Applicable */}
          <FormControl flex="1">
            <Controller
              control={control}
              name={`criteria.${index}.ifApplicable`}
              render={({ field }) => (
                <Select {...field} defaultValue="Yes">
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Select>
              )}
            />
          </FormControl>

          {/* Score */}
          <FormControl flex="1" isInvalid={!!errors.criteria?.[index]?.score}>
            <Controller
              control={control}
              name={`criteria.${index}.score`}
              rules={{ required: "Score is required" }}
              render={({ field }) => (
                <Input {...field} placeholder="Enter score" type="number" />
              )}
            />
            <FormErrorMessage>
              {errors.criteria?.[index]?.score?.message}
            </FormErrorMessage>
          </FormControl>

          {/* Delete Row */}
          <IconButton
            aria-label="Delete row"
            icon={<IoTrashOutline />}
            colorScheme="red"
            variant="ghost"
            onClick={() => remove(index)}
          />
        </HStack>
      ))}
    </VStack>
  </form>
  );

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
                  {renderCriteriaFields(creditPatternFields, appendCreditPattern, removeCreditPattern, "Total Past Credit Count", "creditPattern")}
                  <Divider my={4} />
                  {renderCriteriaFields(creditPatternFields, appendCreditPattern, removeCreditPattern, "Total Past Credit Amount", "creditPattern")}
                  <Divider my={4} />
                  {renderCriteriaFields(creditPatternFields, appendCreditPattern, removeCreditPattern, "Active Credit Amount", "creditPattern")}
                </TabPanel>
                <TabPanel px={0}>
                  {renderCriteriaFields(purchasePatternFields, appendPurchasePattern, removePurchasePattern, "Total Purchase Count", "purchasePattern")}
                  <Divider my={4} />
                  {renderCriteriaFields(purchasePatternFields, appendPurchasePattern, removePurchasePattern, "Total Purchase Amount", "purchasePattern")}
                  <Divider my={4} />
                  {renderCriteriaFields(purchasePatternFields, appendPurchasePattern, removePurchasePattern, "Active Purchase Amount", "purchasePattern")}
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

