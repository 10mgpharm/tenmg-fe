import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import moment from "moment";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Text,
  Grid,
  FormErrorMessage,
} from "@chakra-ui/react";

export interface DateRangeRef {
  getDateRange: () => {
    startDate: string;
    endDate: string;
    isValid: boolean;
  } | null;
  getDateError: () => string;
  resetDates: () => void;
}

interface GenerateDateRangeProps {
  // Add props if needed
}

const GenerateDateRange = forwardRef<DateRangeRef, GenerateDateRangeProps>((props, ref) => {
  const months = moment.months();
  const currentYear = moment().year();
  
  // Generate last 10 years, current year first
  const years = Array.from({ length: 10 }, (_, i) => 
    (currentYear - i).toString()
  );

  const [startDay, setStartDay] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");

  const [endDay, setEndDay] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");

  const [isStartDateFilled, setIsStartDateFilled] = useState(false);
  const [dateError, setDateError] = useState("");

  const cardBg = "gray.50";
  const cardBorder = "gray.200";

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    getDateRange: () => {
      if (!startDay || !startMonth || !startYear || !endDay || !endMonth || !endYear) {
        return null;
      }

      const startDate = getMomentDate(startDay, startMonth, startYear);
      const endDate = getMomentDate(endDay, endMonth, endYear);

      return {
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        isValid: !dateError
      };
    },
    getDateError: () => dateError,
    resetDates: () => {
      setStartDay("");
      setStartMonth("");
      setStartYear("");
      setEndDay("");
      setEndMonth("");
      setEndYear("");
      setDateError("");
    }
  }));

  // Check if start date is fully selected
  useEffect(() => {
    if (startDay && startMonth && startYear) {
      setIsStartDateFilled(true);

      // Auto-set end date to start date as initial value
      if (!endDay || !endMonth || !endYear) {
        setEndDay(startDay);
        setEndMonth(startMonth);
        setEndYear(startYear);
      }
    } else {
      setIsStartDateFilled(false);
    }
  }, [startDay, startMonth, startYear]);

  // Validate end date is after start date
  useEffect(() => {
    if (isStartDateFilled && endDay && endMonth && endYear) {
      const startDate = getMomentDate(startDay, startMonth, startYear);
      const endDate = getMomentDate(endDay, endMonth, endYear);

      if (endDate.isBefore(startDate)) {
        setDateError("End date must be after start date");
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }
  }, [
    startDay,
    startMonth,
    startYear,
    endDay,
    endMonth,
    endYear,
    isStartDateFilled,
  ]);

  function getMomentDate(day: string, month: string, year: string) {
    return moment(`${day} ${month} ${year}`, "D MMMM YYYY");
  }

  function getDaysInMonth(month: string, year: string): number[] {
    if (!month || !year) return [1];

    const date = moment(`1 ${month} ${year}`, "D MMMM YYYY");
    const totalDays = date.daysInMonth();
    return Array.from({ length: totalDays }, (_, i) => i + 1);
  }

  function renderDateFields(
    title: string,
    dayVal: string,
    setDay: React.Dispatch<React.SetStateAction<string>>,
    monthVal: string,
    setMonth: React.Dispatch<React.SetStateAction<string>>,
    yearVal: string,
    setYear: React.Dispatch<React.SetStateAction<string>>,
    isDisabled: boolean = false
  ) {
    const possibleDays = getDaysInMonth(
      monthVal || months[0],
      yearVal || years[0]
    );

    // If selected day isn't valid for this month, adjust it
    if (dayVal && !possibleDays.includes(Number(dayVal))) {
      setDay(String(possibleDays[possibleDays.length - 1]));
    }

    return (
      <Box
        bg={cardBg}
        border="1px"
        borderColor={cardBorder}
        borderRadius="md"
        p={4}
        mb={4}
        opacity={isDisabled ? 0.6 : 1}
      >
        <Text fontWeight="semibold" mb={4}>
          {title}
        </Text>
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          {/* Day (Dropdown) */}
          <FormControl>
            <FormLabel>Day</FormLabel>
            <Select
              value={dayVal}
              onChange={(e) => setDay(e.target.value)}
              placeholder="Day"
              isDisabled={isDisabled}
            >
              {possibleDays.map((d) => (
                <option key={d} value={String(d)}>
                  {d}
                </option>
              ))}
            </Select>
          </FormControl>

          {/* Month */}
          <FormControl>
            <FormLabel>Month</FormLabel>
            <Select
              value={monthVal}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="Month"
              isDisabled={isDisabled}
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </FormControl>

          {/* Year */}
          <FormControl>
            <FormLabel>Year</FormLabel>
            <Select
              value={yearVal}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year"
              isDisabled={isDisabled}
            >
              {years.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Start Date Card */}
      {renderDateFields(
        "Start Date",
        startDay,
        setStartDay,
        startMonth,
        setStartMonth,
        startYear,
        setStartYear,
        false
      )}

      {/* End Date Card */}
      {renderDateFields(
        "End Date",
        endDay,
        setEndDay,
        endMonth,
        setEndMonth,
        endYear,
        setEndYear,
        !isStartDateFilled
      )}

      {/* Date validation error */}
      {dateError && (
        <FormControl isInvalid={!!dateError}>
          <FormErrorMessage color="red.500">{dateError}</FormErrorMessage>
        </FormControl>
      )}
    </Box>
  );
});

GenerateDateRange.displayName = "GenerateDateRange";

export default GenerateDateRange;
