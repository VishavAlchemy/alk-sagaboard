import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";

export default query({
  args: { storageId: v.string() },
  handler: async ({ storage }, { storageId }) => {
    if (!storageId) return null;
    return await storage.getUrl(storageId as Id<"_storage">);
  },
}); 