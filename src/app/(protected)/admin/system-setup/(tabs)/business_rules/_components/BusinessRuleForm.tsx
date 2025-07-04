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
import { BusinessRuleItem, CreditSetting } from "../rules";
import { RuleCondition, RuleOperator } from "../enums";
import { updateCreditBusinessRules } from "../actions";
import { toast } from "react-toastify";

const RuleSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  condition: z.string().min(1, "Condition is required"),
  scoreWeight: z.number().nonnegative(),
  compareValue: z.number().nonnegative(),
  logicalOperator: z.string().min(1),
  active: z.boolean().optional(),
  categoryId: z.number().nonnegative()
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
  "scoreWeight",
  "compareValue",
  "active",
  "categoryId",
];

interface Props {
  token: string;
  initialData: BusinessRuleItem[];
  baseScore: number;
}

export default function BusinessRuleForm({ token: jwtToken, initialData: rules, baseScore }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRecalculatingWeights, setIsRecalculatingWeights] = useState(false);
  const [scoreWeightErrors, setScoreWeightErrors] = useState<Record<number, string>>({});

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      baseScore,
      rules,
    },
  });
  const { fields } = useFieldArray({ control, name: "rules" });

  const watchedRules = watch("rules");
  const watchedBaseScore = watch("baseScore");

  const totalParams = watchedRules.length;
  const totalEnabled = watchedRules.filter((r) => r.active).length;
  const rawTotalScoreWeight = watchedRules
    .filter((r) => r.active)
    .reduce((sum, r) => sum + (r.scoreWeight || 0), 0);
  const totalScoreWeight = Number.isInteger(rawTotalScoreWeight)
    ? rawTotalScoreWeight
    : parseFloat(rawTotalScoreWeight.toFixed(1));
  const scoreMatches = totalScoreWeight == watchedBaseScore;

  useEffect(() => {
    watchedRules.forEach((rule, index) => {
      const operator = RuleOperator[rule.condition as keyof typeof RuleOperator];
      if (operator && rule.logicalOperator !== operator) {
        setValue(`rules.${index}.logicalOperator`, operator);
      }
    });
  }, [watchedRules, setValue]);

  useEffect(() => {
    if (!watchedBaseScore || watchedBaseScore <= 0) return;

    const activeRules = watchedRules.filter(r => r.active);
    if (activeRules.length === 0) return;

    setIsRecalculatingWeights(true);

    const newWeights = recalculateWeights(watchedRules as BusinessRuleItem[], watchedBaseScore);

    setTimeout(() => {
      Object.entries(newWeights).forEach(([index, weight]) => {
        setValue(`rules.${Number(index)}.scoreWeight`, weight, {
          shouldValidate: true,
        });
      });

      setIsRecalculatingWeights(false);
    }, 300); // Optional delay for smooth UI
  }, [watchedBaseScore, watchedRules, setValue]);

  const recalculateWeights = (rules: BusinessRuleItem[], baseScore: number) => {
    const activeRules = rules.filter(r => r.active);
    if (activeRules.length === 0) return {};

    const rawWeight = baseScore / activeRules.length;

    const weightPerRule = Number.isInteger(rawWeight)
      ? rawWeight
      : parseFloat(rawWeight.toFixed(1));

    const newWeights: Record<number, number> = {};

    rules.forEach((rule, idx) => {
      newWeights[idx] = rule.active ? weightPerRule : 0;
    });

    return newWeights;
  };

  const autoSave = debounce(async (token: string, data: FormValues) => {
    setIsSaving(true);
    const response = await updateCreditBusinessRules(token, data as CreditSetting);
    if (response.status === "error") {
      toast.error(response.message);
    }
    setIsSaving(false);
  }, 1000);

  // TODO: background auto save sync - optional
  // useEffect(() => {
  //   const subscription = watch((value, { name }) => {
  //     if (name === "baseScore") {
  //       autoSave(jwtToken, value as FormValues);
  //     }
  //   });

  //   return () => subscription.unsubscribe();
  // }, [autoSave, jwtToken, watch]);

  const onSubmit = async (data: FormValues) => {
    // validate form firss
    if (!isValid) trigger()

    setIsLoading(true);

    const response = await updateCreditBusinessRules(jwtToken, data as CreditSetting);
    if (response.status === "error") {
      toast.error(response.message);
    }

    setIsLoading(false);
    toast.success(response.message);
  }

  return (
    <div className="sm:px-4">
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div>
            <h2 className="text-[17px] font-semibold">Business Rules</h2>
            <p className="text-[15px] text-gray-700 pt-1">
              Set maximum base score for business rules parameters
            </p>
          </div>
          <Button isLoading={isLoading} onClick={handleSubmit(onSubmit)} className="w-full sm:w-auto">
            Save Changes
          </Button>
        </div>

        <div className="mt-6 mb-4 p-4 bg-white shadow-sm rounded-md">
          {isRecalculatingWeights ? (
            <div className="w-full animate-pulse gap-3 sm:gap-5 flex items-center flex-col sm:flex-row">
              <Text fontSize="sm" color="gray.700" className="text-center sm:text-left">
                <strong>Total Parameters:</strong> {totalParams}
              </Text>
              <div className="h-4 w-full sm:w-1/3 bg-gray-200 rounded" />
              <div className="h-4 w-2/3 sm:w-1/5 bg-gray-200 rounded" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-6 w-full">
              <Text fontSize="sm" color="gray.700" className="text-center sm:text-left">
                <strong>Total Parameters:</strong> {totalParams}
              </Text>
              <Text fontSize="sm" color="gray.700" className="text-center sm:text-left">
                <strong>Enabled:</strong> {totalEnabled}
              </Text>
              <Text fontSize="sm" color={scoreMatches ? "green.600" : "red.500"} className="text-center sm:text-left">
                <strong>Score Weights:</strong> {totalScoreWeight} / {watchedBaseScore}
                {!scoreMatches && " (Mismatch)"}
              </Text>
            </div>
          )}
        </div>

        <div className="shadow-sm bg-white p-4 rounded-md mt-5 flex flex-col md:flex-row items-start md:items-center gap-5">
          <FormControl
            isInvalid={!!errors.baseScore?.message}
            className="w-full md:max-w-[400px]"
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
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {Object.keys(scoreWeightErrors).length > 0 && (
              <Text as={"span"} className="text-red-500 text-sm w-full md:w-auto">
                {Object.values(scoreWeightErrors)[0]}
              </Text>
            )}
            {isSaving && (
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Text fontSize="sm" color="gray.500">
                  Saving...
                </Text>
                <Box boxSize="3" className="animate-spin border-t-2 border-r-2 border-gray-500 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>

      <Box overflowX="auto" className="mt-6 sm:mx-0 shadow-sm rounded-md border border-gray-200">
        <Table variant="unstyled" size="sm" className="w-full min-w-[800px]">
          <Thead position="sticky" top={0} zIndex={1} backgroundColor="white">
            <Tr>
              {columnHeaders.map((header, idx) => (
                <Th
                  key={header}
                  position={["static", idx === 0 ? "sticky" : "static"]}
                  left={idx === 0 ? 0 : undefined}
                  zIndex={idx === 0 ? 3 : 1}
                  minW="20px"
                  maxW="20px"
                  h={50}
                  className={cn(
                    "bg-primary/50", 
                    idx === 0 && "bg-primary-800 text-white font-bold border-r-2 border-gray",
                    "text-[10px] sm:text-xs whitespace-nowrap py-3"
                  )}
                >
                  {header === "name" 
                    ? "Parameter" 
                    : header === "scoreWeight" 
                      ? "Score" 
                      : header === "compareValue" 
                        ? "Value" 
                        : header === "categoryId" 
                          ? "Category" 
                          : header.replace("_", " ")}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {fields.map((field, index) => (
              <Tr key={field.id || index}>
                <Td
                  position={["static", "sticky"]}
                  left={0}
                  zIndex={2}
                  minW={{ base: "180px", sm: "250px" }}
                  maxW={{ base: "180px", sm: "250px" }}
                  className={
                    cn(
                      "border-r-2 border-gray bg-black",
                      watchedRules[index].categoryId === 1 ? "bg-red-50" : "bg-green-50"
                    )
                  }
                >
                  <Input
                    variant="flushed"
                    size="sm"
                    className="text-xs sm:text-sm"
                    {...register(`rules.${index}.name`)}
                  />
                </Td>
                <Td minW={{ base: "250px", sm: "350px" }}>
                  <Input
                    variant="flushed"
                    size="sm"
                    className="text-xs sm:text-sm"
                    {...register(`rules.${index}.description`)}
                  />
                </Td>
                <Td minW="220px">
                  <Select
                    size="sm"
                    className="text-xs sm:text-sm"
                    {...register(`rules.${index}.condition`)}
                  >
                    {Object.values(RuleCondition).map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </Select>
                </Td>
                <Td minW={{ base: "150px", sm: "200px" }}>
                  {isRecalculatingWeights ? (
                    <Box height="32px" className="rounded bg-gray-200 animate-pulse" />
                  ) : (
                    <Input
                      type="number"
                      size="sm"
                      className="text-xs sm:text-sm"
                      isInvalid={!!scoreWeightErrors[index]}
                      sx={
                        scoreWeightErrors[index]
                          ? {
                            backgroundColor: "red.50",
                            borderColor: "red.500",
                            _focus: {
                              backgroundColor: "red.100",
                              borderColor: "red.600",
                              boxShadow: "0 0 0 1px red.500",
                            },
                          }
                          : {}
                      }
                      {...register(`rules.${index}.scoreWeight`, {
                        valueAsNumber: true,
                        onChange: (e) => {
                          const newValue = Number(e.target.value);

                          const activeRules = watchedRules.map((r, i) =>
                            i === index ? { ...r, scoreWeight: newValue } : r
                          ).filter(r => r.active);

                          const rawTotalScoreWeight = activeRules.reduce((sum, r) => sum + (r.scoreWeight || 0), 0);
                          const totalWeight = Number.isInteger(rawTotalScoreWeight)
                            ? rawTotalScoreWeight
                            : parseFloat(rawTotalScoreWeight.toFixed(1));

                          if (totalWeight == watchedBaseScore) {
                            // ✅ Clear all errors if weights are correct
                            setScoreWeightErrors({});
                          } else {
                            // ❌ Total mismatch — clear this input's error (if any), keep others
                            setScoreWeightErrors((prev) => {
                              const { [index]: _, ...rest } = prev;
                              return {
                                ...rest,
                                [index]: `Total active score weight (${totalWeight}) must equal baseScore (${watchedBaseScore})`,
                              };
                            });
                          }
                        }
                      })}
                    />
                  )}
                </Td>
                <Td minW={{ base: "150px", sm: "200px" }}>
                  <Input
                    type="number"
                    size="sm"
                    className="text-xs sm:text-sm"
                    {...register(`rules.${index}.compareValue`, {
                      valueAsNumber: true,
                    })}
                  />
                </Td>
                <Td maxW={{ base: "80px", sm: "100px" }} minW={{ base: "80px", sm: "100px" }}>
                  <Switch size="sm"
                    isChecked={watchedRules[index].active}
                    onChange={(e) => {
                      setIsRecalculatingWeights(true);

                      const updatedRules = [...watchedRules];
                      updatedRules[index].active = e.target.checked;

                      const newWeights = recalculateWeights(updatedRules as BusinessRuleItem[], watchedBaseScore);

                      setTimeout(() => {
                        Object.entries(newWeights).forEach(([i, weight]) => {
                          const index = Number(i);
                          setValue(`rules.${index}.scoreWeight`, weight, {
                            shouldValidate: true,
                          });
                        });

                        setValue(`rules.${index}.active`, e.target.checked);

                        setIsRecalculatingWeights(false);
                      }, 300);

                    }}
                  />
                </Td>
                <Td minW={{ base: "150px", sm: "200px" }}>
                  <Select
                    size="sm"
                    className="text-xs sm:text-sm"
                    {...register(`rules.${index}.categoryId`, {
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
