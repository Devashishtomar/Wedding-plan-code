import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number, currencyCode?: "USD" | "INR") => {
  const activeCurrency = currencyCode || (localStorage.getItem("app_currency") as "USD" | "INR") || "USD";
  const targetLocale = activeCurrency === "INR" ? "en-IN" : "en-US";

  return new Intl.NumberFormat(targetLocale, {
    style: "currency",
    currency: activeCurrency,
    minimumFractionDigits: 0,
  }).format(amount);
};