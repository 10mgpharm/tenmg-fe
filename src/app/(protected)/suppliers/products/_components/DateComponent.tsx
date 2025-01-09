import { Dispatch, SetStateAction } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar } from "react-icons/fi";

interface DateProps {
  startDate: Date | null;
  setStartDate: Dispatch<SetStateAction<Date | null>>;
  isMinDate?: boolean;
  isMaxDate?: boolean
  minDate?: Date | null;
}
const DateComponent = ({
  isMinDate,
  startDate,
  setStartDate,
  minDate,
  isMaxDate
}: DateProps) => {
  return (
    <DatePicker
      placeholderText="MM/DD/YYYY"
      selected={startDate}
      toggleCalendarOnIconClick
      minDate={!isMinDate ? new Date() : minDate}
      maxDate={isMaxDate ? new Date() : null}
      showIcon
      icon={<FiCalendar className="w-5 h-5 text-gray-600" />}
      onChange={(date: Date | null) => setStartDate(date)}
      className="text-sm outline-none placeholder:text-gray-500"
    />
  );
};

export default DateComponent;
