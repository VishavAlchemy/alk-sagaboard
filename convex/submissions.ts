import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Create a new submission
export const createSubmission = mutation({
  args: {
    taskId: v.id("tasks"),
    userId: v.string(),
    text: v.string(),
    url: v.optional(v.string()),
    fileId: v.optional(v.string()),
    fileName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the task and company info
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");
    
    const company = await ctx.db.get(task.companyId);
    if (!company) throw new Error("Company not found");

    // Create the submission
    const submissionId = await ctx.db.insert("submissions", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create notification for company admin
    if (company.adminId) {
      await ctx.db.insert("notifications", {
        userId: company.adminId,
        type: "task_submission",
        title: "New Task Submission",
        message: `A new submission has been received for task: ${task.name || task.text}`,
        read: false,
        metadata: {
          taskId: args.taskId,
          submissionId,
          companyId: task.companyId,
        },
        createdAt: Date.now(),
      });
    }

    return submissionId;
  },
});

// Get submissions for a task
export const getTaskSubmissions = query({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("submissions")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .order("desc")
      .collect();
  },
});

// Get submissions by a user
export const getUserSubmissions = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("submissions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Update submission status
export const updateSubmissionStatus = mutation({
  args: {
    submissionId: v.id("submissions"),
    status: v.string(),
    adminId: v.string(),
  },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) throw new Error("Submission not found");

    const task = await ctx.db.get(submission.taskId);
    if (!task) throw new Error("Task not found");

    // Update the submission status
    await ctx.db.patch(args.submissionId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    // Create notification for the submitter
    await ctx.db.insert("notifications", {
      userId: submission.userId,
      type: "submission_status_update",
      title: `Submission ${args.status}`,
      message: `Your submission for task "${task.name || task.text}" has been ${args.status}`,
      read: false,
      metadata: {
        taskId: submission.taskId,
        submissionId: args.submissionId,
        companyId: task.companyId,
      },
      createdAt: Date.now(),
    });

    return true;
  },
});

// Get notifications for a user
export const getUserNotifications = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Mark notification as read
export const markNotificationRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, {
      read: true,
    });
    return true;
  },
}); 