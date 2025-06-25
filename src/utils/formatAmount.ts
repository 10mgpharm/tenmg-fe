export function formatAmount(
  amount: number | string,
  locale: string = "en-NG"
): string {
  const value = Number(amount);
  const roundedValue = value;
  return `₦${roundedValue.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
