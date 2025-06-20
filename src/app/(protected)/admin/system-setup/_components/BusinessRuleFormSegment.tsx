"use client";

import debounce from "lodash.debounce";
import { cn } from "@/lib/utils";
import {
  Box,
  Input,
  Switch,
  FormControl,
  FormLabel,
  Select,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";

export enum RuleCondition {
  GreaterThan = 'GreaterThan',
  GreaterThanOrEqual = 'GreaterThanOrEqual',
  LessThan = 'LessThan',
  LessThanOrEqual = 'LessThanOrEqual',
  Equals = 'Equals',
  None = 'None'
}

export enum RuleOperator {
  GreaterThan = '>',
  GreaterThanOrEqual = '>=',
  LessThan = '<',
  LessThanOrEqual = '<=',
  Equals = '==',
  None = ''
}

export type BusinessRuleItem = {
  id?: number;
  name: string;
  active: boolean;
  condition: RuleCondition;
  category_id: number;
  description: string;
  score_weight: number;
  compare_value: number;
  logical_operator: RuleOperator;
}

const RuleSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  condition: z.string().min(1, "Condition is required"),
  score_weight: z.number().nonnegative(),
  compare_value: z.number().nonnegative(),
  logical_operator: z.string().min(1),
  active: z.boolean().optional(),
  category_id: z.number().nonnegative()
});

const FormSchema = z.object({
  baseScore: z.number().nonnegative(),
  rules: z.array(RuleSchema),
});

type FormValues = z.infer<typeof FormSchema>;

const columnHeaders = [
  "name",
  "description",
  "condition",
  "score_weight",
  "compare_value",
  "active",
  "category_id",
];

export default function BusinessRuleForm({ initialData }: { initialData: BusinessRuleItem[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [scoreWeightErrors, setScoreWeightErrors] = useState<Record<number, string>>({});

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      baseScore: 0,
      rules: initialData,
    },
  });
  const { fields } = useFieldArray({ control, name: "rules" });

  const watchedRules = watch("rules");
  const watchedBaseScore = watch("baseScore");

  useEffect(() => {
    watchedRules.forEach((rule, index) => {
      const operator = RuleOperator[rule.condition as keyof typeof RuleOperator];
      if (operator && rule.logical_operator !== operator) {
        setValue(`rules.${index}.logical_operator`, operator);
      }
    });
  }, [watchedRules, setValue]);

  useEffect(() => {
    if (!watchedBaseScore || watchedBaseScore <= 0) return;

    const activeRules = watchedRules.filter(r => r.active);
    if (activeRules.length === 0) return;

    const equalWeight = Math.floor(watchedBaseScore / activeRules.length);

    watchedRules.forEach((rule, index) => {
      if (rule.active) {
        setValue(`rules.${index}.score_weight`, equalWeight, {
          shouldValidate: true,
        });
      }
    });
  }, [watchedBaseScore, watchedRules, setValue]);

  const recalculateWeights = (rules: BusinessRuleItem[], baseScore: number) => {
    const activeRules = rules.filter(r => r.active);
    if (activeRules.length === 0) return {};

    const weightPerRule = Math.floor(baseScore / activeRules.length);
    const newWeights: Record<number, number> = {};

    rules.forEach((rule, idx) => {
      newWeights[idx] = rule.active ? weightPerRule : 0;
    });

    return newWeights;
  };

  // const autoSave = debounce((rules) => {
  //   setIsSaving(true);
  //   console.log("Saving", rules);

  //   // Simulate async save (e.g. replace with your real fetch/axios POST)
  //   setTimeout(() => {
  //     setIsSaving(false);
  //   }, 500); // simulate 500ms save delay
  // }, 1000);

  // useEffect(() => {
  //   const subscription = watch((value) => {
  //     autoSave(value.rules);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [autoSave, watch]);

  return (
    <div>
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-[17px] font-semibold">Business Rules</h2>
            <p className="text-[15px] text-gray-700 pt-1">
              Set maximum base score for business rules parameters
            </p>
          </div>
          <Button isLoading={isLoading}>
            Save Changes
          </Button>
        </div>

        <div className="shadow-sm bg-white p-4 rounded-md space-y-4 mt-5 flex flex-row flex-wrap md:flex-nowrap items-center justify-between gap-5">
          <FormControl
            isInvalid={!!errors.baseScore?.message}
            className="w-full max-w-[400px]"
          >
            <FormLabel>Max Base Credit Score</FormLabel>
            <Input
              type={"number"}
              placeholder="Enter 10mg commission on each product"
              {...register("baseScore", {
                required: "Enter commission on each product",
              })}
              disabled={isLoading}
            />
            {errors.baseScore && (
              <Text as={"span"} className="text-red-500 text-sm">
                {errors.baseScore?.message}
              </Text>
            )}
          </FormControl>
          <div className="flex items-center space-x-2">
            {isSaving && (
              <>
                <Text fontSize="sm" color="gray.500">
                  Saving...
                </Text>
                <Box boxSize="3" className="animate-spin border-t-2 border-r-2 border-gray-500 rounded-full" />
              </>
            )}
          </div>
        </div>
      </div>

      <Box overflowX="auto">
        <Table variant="unstyled" size="sm">
          <Thead position="sticky" top={0} zIndex={1} backgroundColor="white">
            <Tr>
              {columnHeaders.map((header, idx) => (
                <Th
                  key={header}
                  position={idx === 0 ? "sticky" : "static"}
                  left={idx === 0 ? 0 : undefined}
                  zIndex={idx === 0 ? 3 : 1}
                  minW="20px"
                  maxW="20px"
                  h={50}
                  className={cn("bg-primary/50", idx === 0 && "bg-primary-800 text-white font-bold border-r-2 border-gray")}
                >
                  {header === "name" ? "Parameter" : header.replace("_", " ")}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {fields.map((field, index) => (
              <Tr key={field.id || index}>
                <Td
                  position="sticky"
                  left={0}
                  zIndex={2}
                  minW="250px"
                  maxW="250px"
                  className={
                    cn(
                      "border-r-2 border-gray bg-black",
                      watchedRules[index].category_id === 1 ? "bg-red-50" : "bg-green-50"
                    )
                  }
                >
                  <Input
                    variant="flushed"
                    size="sm"
                    {...register(`rules.${index}.name`)}
                  />
                </Td>
                <Td minW="350px">
                  <Input
                    variant="flushed"
                    size="sm"
                    {...register(`rules.${index}.description`)}
                  />
                </Td>
                <Td minW="220px">
                  <Select
                    size="sm"
                    {...register(`rules.${index}.condition`)}
                  >
                    {Object.values(RuleCondition).map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </Select>
                </Td>
                <Td minW="200px">
                  <Input
                    type="number"
                    size="sm"
                    {...register(`rules.${index}.score_weight`, {
                      valueAsNumber: true,
                      onChange: (e) => {
                        const newValue = Number(e.target.value);

                        const activeRules = watchedRules.map((r, i) =>
                          i === index ? { ...r, score_weight: newValue } : r
                        ).filter(r => r.active);

                        const totalWeight = activeRules.reduce((sum, r) => sum + (r.score_weight || 0), 0);

                        if (totalWeight != watchedBaseScore) {
                          setScoreWeightErrors((prev) => ({
                            ...prev,
                            [index]: `Total active score weight (${totalWeight}) must equal baseScore (${watchedBaseScore})`,
                          }));
                        } else {
                          setScoreWeightErrors((prev) => {
                            const { [index]: _, ...rest } = prev;
                            return rest;
                          });
                        }
                      }
                      
                    })}
                  />
                  {scoreWeightErrors[index] && (
                    <Text fontSize="xs" color="red.500">
                      {scoreWeightErrors[index]}
                    </Text>
                  )}
                </Td>
                <Td minW="200px">
                  <Input
                    type="number"
                    size="sm"
                    {...register(`rules.${index}.compare_value`, {
                      valueAsNumber: true,
                    })}
                  />
                </Td>
                <Td maxW="100px" minW="100px">
                  <Switch size="sm"
                    isChecked={watchedRules[index].active}
                    onChange={(e) => {
                      const updatedRules = [...watchedRules];
                      updatedRules[index].active = e.target.checked;

                      const newWeights = recalculateWeights(updatedRules as BusinessRuleItem[], watchedBaseScore);

                      Object.entries(newWeights).forEach(([i, weight]) => {
                        const index = Number(i);
                        setValue(`rules.${index}.score_weight`, weight, {
                          shouldValidate: true,
                        });
                      });

                      setValue(`rules.${index}.active`, e.target.checked);
                    }}
                  />
                </Td>
                <Td minW="200px">
                  <Select
                    size="sm"
                    {...register(`rules.${index}.category_id`, {
                      valueAsNumber: true,
                    })}
                  >
                    <option value={1}>Credit Pattern</option>
                    <option value={2}>Purchase Pattern</option>
                  </Select>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </div>
  );
}
