import { useQuery } from "convex/react";
import { api } from "./_generated/api";

export function useStorageUrl(storageId: string | null) {
  return useQuery(api.getStorageUrl.default, { storageId: storageId ?? "" });
} 