export function formatAmount(amount: number | string, locale: string = "en-NG"): string {
    const value = Number(amount);
    const roundedValue = Math.round(value);
    return `₦${roundedValue.toLocaleString(locale)}`;
  }
  