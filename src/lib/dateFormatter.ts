import moment from "moment";

export const formatDateRange = (
  dateString: string | Date,
  isEndDate?: boolean
) => {
  if (!dateString) return null;
  const formattedDate = isEndDate
    ? moment(dateString).endOf("day").format("YYYY-MM-DD HH:mm:ss")
    : moment(dateString).startOf("day").format("YYYY-MM-DD HH:mm:ss");
  return formattedDate;
};
