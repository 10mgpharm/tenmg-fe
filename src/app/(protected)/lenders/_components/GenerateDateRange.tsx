import React, { useState } from "react";
import moment from "moment";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Text,
  Grid,
} from "@chakra-ui/react";

export default function GenerateDateRange() {
  const months = moment.months();

  const years = ["2022", "2023", "2024", "2025", "2026"];

  const [startDay, setStartDay] = useState("1");
  const [startMonth, setStartMonth] = useState("January");
  const [startYear, setStartYear] = useState("2023");

  const [endDay, setEndDay] = useState("1");
  const [endMonth, setEndMonth] = useState("January");
  const [endYear, setEndYear] = useState("2023");

  const cardBg = "gray.50";
  const cardBorder = "gray.200";

  function getMomentDate(day: string, month: string, year: string) {
    return moment(`${day} ${month} ${year}`, "D MMMM YYYY");
  }

  function getDaysInMonth(month: string, year: string): number[] {
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
    setYear: React.Dispatch<React.SetStateAction<string>>
  ) {
    const possibleDays = getDaysInMonth(monthVal, yearVal);

    if (!possibleDays.includes(Number(dayVal))) {
      setDay(String(possibleDays[0]));
    }

    return (
      <Box
        bg={cardBg}
        border="1px"
        borderColor={cardBorder}
        borderRadius="md"
        p={4}
        mb={4}
      >
        <Text fontWeight="semibold" mb={4}>
          {title}
        </Text>
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          {/* Day (Dropdown) */}
          <FormControl>
            <FormLabel>Day</FormLabel>
            <Select value={dayVal} onChange={(e) => setDay(e.target.value)}>
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
            <Select value={monthVal} onChange={(e) => setMonth(e.target.value)}>
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
            <Select value={yearVal} onChange={(e) => setYear(e.target.value)}>
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
        setStartYear
      )}

      {/* End Date Card */}
      {renderDateFields(
        "End Date",
        endDay,
        setEndDay,
        endMonth,
        setEndMonth,
        endYear,
        setEndYear
      )}
    </Box>
  );
}
