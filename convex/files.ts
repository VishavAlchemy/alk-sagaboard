import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Generate a URL for uploading a file
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Register an uploaded file in the database
export const uploadFile = mutation({
  args: {
    storageId: v.string(),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    // You could also save file metadata in a separate table if needed
    return args.storageId;
  },
}); 