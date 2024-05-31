import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function chatHrefConstructor(id1: string, id2: string) {
  const sortedIds = [id1, id2].sort();
  return `${sortedIds[0]}--${sortedIds[1]}`;
}

// Helper function to transform strings in to Pusher's key, (because Pusher doesn't allow colons)
export function toPusherKey(key: string) {
  return key.replace(/:/g, "__");
}

export const GRADIENT_PALETTE = [
  "linear-gradient(180deg, #A9C9FF 0%, #FFBBEC 100%)",
  "linear-gradient(19deg, #FAACA8 0%, #DDD6F3 100%)",
  "linear-gradient(19deg, #3EECAC 0%, #EE74E1 100%)",
  "linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%)",
  "linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)",
];

export function randomGradientGenerator() {
  const randomIndex = Math.floor(
    Math.random() * (GRADIENT_PALETTE.length - 0) + 0
  );
  return GRADIENT_PALETTE[randomIndex];
}
