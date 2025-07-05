import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};

export const formatAddress = (address?: string) => {
  if (!address || address.length < 10) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const calculateReadTime = (content: string): string => {
  if (!content) return "1 min read";

  const words = content.trim().split(/\s+/).length;

  const minutes = Math.max(1, Math.ceil(words / 225));

  return `${minutes} min read`;
};
