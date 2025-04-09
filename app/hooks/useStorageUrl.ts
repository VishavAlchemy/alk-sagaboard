import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useStorageUrl(storageId: string | null | undefined): string | null {
  const url = useQuery(api.getStorageUrl.default, storageId ? { storageId } : "skip");
  return url ?? null;
} 