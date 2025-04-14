import { useQuery } from "convex/react";
import { api } from "./_generated/api";

export function useStorageUrl(storageId: string | null) {
  const url = useQuery(api.getStorageUrl.default, { storageId: storageId ?? "" });
  
  // Return null if we have no storage ID, are loading, or got null from the query
  if (!storageId || url === undefined || url === null) {
    return null;
  }
  
  return url;
} 