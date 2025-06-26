export function formatAmount(
  amount: number | string,
  locale: string = "en-NG"
): string {
  const value = Number(amount);
  return `₦${value.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
