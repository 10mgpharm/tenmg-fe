import React, { useEffect } from "react";
import {
  Controller,
  Control,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { FormControl, FormLabel } from "@chakra-ui/react";
import DateComponent from "../suppliers/products/_components/DateComponent";

interface IFormInput {
  startDate?: Date | null;
  endDate?: Date | null;
}

interface DateRangeProps {
  fromName: keyof IFormInput; //  "startDate"
  toName: keyof IFormInput; //  "endDate"
  control: Control<IFormInput>;
  watch: UseFormWatch<IFormInput>;
  setValue: UseFormSetValue<IFormInput>;
  labelFrom?: string;
  labelTo?: string;
  // If you want to control min/max logic on "From" date or "To" date,
}

const DateRange: React.FC<DateRangeProps> = ({
  fromName,
  toName,
  control,
  watch,
  setValue,
  labelFrom = "From",
  labelTo = "To",
}) => {
  const watchFrom = watch(fromName);
  const watchTo = watch(toName);

  useEffect(() => {
    if (watchFrom && watchTo && watchFrom > watchTo) {
      setValue(toName, null);
    }
  }, [watchFrom, watchTo, setValue, toName]);

  return (
    <>
      <FormControl>
        <FormLabel>{labelFrom}</FormLabel>
        <Controller
          name={fromName}
          control={control}
          render={({ field }) => (
            <DateComponent
              startDate={field.value}
              setStartDate={field.onChange}
              isMinDate
            />
          )}
        />
      </FormControl>

      <FormControl>
        <FormLabel>{labelTo}</FormLabel>
        <Controller
          name={toName}
          control={control}
          render={({ field }) => (
            <DateComponent
              startDate={field.value}
              setStartDate={field.onChange}
              isMinDate
              minDate={watchFrom}
            />
          )}
        />
      </FormControl>
    </>
  );
};

export default DateRange;
