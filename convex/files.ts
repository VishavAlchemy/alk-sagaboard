import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";

// Generate a URL for uploading a file
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // Generate a URL that will be valid for 60 seconds
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
    // Here you might want to store file metadata in a table
    // For now, we'll just return the storageId
    return args.storageId;
  },
});

// Delete a file from storage
export const deleteFile = mutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      await ctx.storage.delete(args.storageId);
      return true;
    } catch (error) {
      throw new ConvexError("Failed to delete file");
    }
  },
});

export const getUrl = query({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const url = await ctx.storage.getUrl(args.storageId);
      if (!url) {
        throw new ConvexError("File not found");
      }
      return url;
    } catch (error) {
      throw new ConvexError("Failed to get file URL");
    }
  },
}); 