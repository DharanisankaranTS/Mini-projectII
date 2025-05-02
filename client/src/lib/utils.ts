import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a wallet address for display by shortening it
 */
export function formatWalletAddress(address: string): string {
  if (!address) return "";
  if (address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date | string): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Formats a timestamp to a readable date and time string
 */
export function formatTimestamp(timestamp: number | string): string {
  if (!timestamp) return "";
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * Converts a string to title case (capitalize first letter of each word)
 */
export function toTitleCase(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Gets color class based on compatibility score
 */
export function getCompatibilityColorClass(score: number): string {
  if (score >= 90) return "text-green-600 bg-green-100";
  if (score >= 75) return "text-primary-600 bg-primary-100";
  if (score >= 50) return "text-yellow-600 bg-yellow-100";
  return "text-red-600 bg-red-100";
}

/**
 * Gets color class based on status string
 */
export function getStatusColorClass(status: string): string {
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes("approved") || statusLower.includes("confirmed") || statusLower.includes("success") || statusLower.includes("active")) {
    return "bg-green-100 text-green-800";
  }
  
  if (statusLower.includes("pending") || statusLower.includes("waiting")) {
    return "bg-yellow-100 text-yellow-800";
  }
  
  if (statusLower.includes("rejected") || statusLower.includes("cancelled") || statusLower.includes("failed")) {
    return "bg-red-100 text-red-800";
  }
  
  return "bg-slate-100 text-slate-800";
}

/**
 * Determines if a string is a valid JSON
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}
