import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const maskAccountNumber = (accountNumber: string): string => {
  if (accountNumber.length !== 10) return accountNumber;
  return `${accountNumber.slice(0, 3)}****${accountNumber.slice(-3)}`;
};