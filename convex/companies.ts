import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const seedCompany = mutation({
  args: {
    adminId: v.string(),
  },
  handler: async (ctx, args) => {
    const companyData = {
      name: "SagaCity",
      role: "Building Infrastructure for the New Internet",
      location: "Laval QC",
      image: "/alk-city.svg",
      color: "#4F46E5", // Indigo color for the brand
      adminId: args.adminId,
      socialLinks: {
        website: "https://alk-city.vercel.app",
      },
      vision: "To create a digital ecosystem that enables digital collaboration & creativity.",
      mission: "To build the next generation of digital brands & products.",
      principles: [
        "We are lifelong learners",
        "Together we can achieve more than any individual can alone",
        "We empower individuals to create & innovate",
        "We are a community of creators"
      ],
      values: [
        "Creativity",
        "Productivity",
        "Collaboration",
        "Innovation"
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Check if company already exists
    const existingCompany = await ctx.db
      .query("companies")
      .filter((q) => q.eq(q.field("adminId"), args.adminId))
      .first();

    let companyId;
    if (existingCompany) {
      // Update existing company
      await ctx.db.patch(existingCompany._id, companyData);
      companyId = existingCompany._id;
    } else {
      // Create new company
      companyId = await ctx.db.insert("companies", companyData);
    }

    // Create a sample checklist
    const checklistId = await ctx.db.insert("checklists", {
      creatorId: args.adminId,
      name: "Authentication Service Setup",
      items: [
        { id: "1", text: "Research auth service options", completed: false },
        { id: "2", text: "Create technical specification", completed: false },
        { id: "3", text: "Set up development environment", completed: false },
        { id: "4", text: "Implement basic auth flow", completed: false },
        { id: "5", text: "Add social login providers", completed: false },
        { id: "6", text: "Write tests", completed: false },
        { id: "7", text: "Document the implementation", completed: false },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Seed initial tasks with new format
    const initialTasks = [
      {
        category: "Building",
        name: "Implement new authentication service",
        text: "Set up and implement a new authentication service",
        forRole: "Frontend Developers",
        reward: {
          type: "Fixed Price",
          details: {
            amount: "200",
            currency: "USD",
            description: "Plus gas fees covered"
          }
        },
        description: "Set up and implement a new authentication service to improve security and user management.",
        explanation: "Our current auth system needs upgrading to handle increased user load and provide better security features.",
        checklistId,
      },
      {
        category: "Marketing",
        name: "Launch social media campaign",
        text: "Launch new social media campaign across platforms",
        forRole: "Marketing Team",
        reward: {
          type: "Fixed Price",
          details: {
            amount: "800",
            currency: "USD",
            description: "Performance bonus available"
          }
        },
        description: "Create and launch a comprehensive social media campaign",
        explanation: "We need to increase our brand visibility and engagement across social platforms.",
      },
    ];

    for (const task of initialTasks) {
      await ctx.db.insert("tasks", {
        companyId,
        status: "pending",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...task,
      });
    }

    return companyId;
  },
});

export const createChecklist = mutation({
  args: {
    creatorId: v.string(),
    name: v.string(),
    items: v.array(v.object({
      id: v.string(),
      text: v.string(),
      completed: v.boolean(),
    })),
  },
  handler: async (ctx, args) => {
    const checklistId = await ctx.db.insert("checklists", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return checklistId;
  },
});

export const getChecklists = query({
  args: {
    creatorId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("checklists")
      .withIndex("by_creator", (q) => q.eq("creatorId", args.creatorId))
      .collect();
  },
});

export const createTask = mutation({
  args: {
    companyId: v.id("companies"),
    category: v.string(),
    name: v.string(),
    text: v.string(),
    forRole: v.optional(v.string()),
    reward: v.union(
      v.number(),
      v.object({
        type: v.string(),
        details: v.object({
          amount: v.string(),
          currency: v.string(),
          description: v.optional(v.string())
        })
      })
    ),
    description: v.optional(v.string()),
    explanation: v.optional(v.string()),
    checklistId: v.optional(v.id("checklists")),
  },
  handler: async (ctx, args) => {
    // Verify company exists
    const company = await ctx.db.get(args.companyId);
    if (!company) {
      throw new Error("Company not found");
    }

    // If checklistId is provided, verify it exists
    if (args.checklistId) {
      const checklist = await ctx.db.get(args.checklistId);
      if (!checklist) {
        throw new Error("Checklist not found");
      }
    }

    const taskId = await ctx.db.insert("tasks", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return taskId;
  },
});

export const getTasks = query({
  args: {
    companyId: v.id("companies"),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let tasksQuery = ctx.db
      .query("tasks")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId));

    if (args.category) {
      tasksQuery = tasksQuery.filter((q) => 
        q.eq(q.field("category"), args.category)
      );
    }

    return await tasksQuery.collect();
  },
});

export const getCompany = query({
  args: {
    companyId: v.optional(v.id("companies")),
    adminId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.companyId) {
      return await ctx.db.get(args.companyId);
    }
    if (args.adminId) {
      return await ctx.db
        .query("companies")
        .filter((q) => q.eq(q.field("adminId"), args.adminId))
        .collect();
    }
    return await ctx.db
      .query("companies")
      .collect();
  },
});

export const isCompanyAdmin = query({
  args: {
    userId: v.string(),
    companyId: v.id("companies"),
  },
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.companyId);
    return company?.adminId === args.userId;
  },
});

export const updateCompany = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
    role: v.string(),
    location: v.string(),
    image: v.string(),
    storageId: v.optional(v.string()),
    color: v.string(),
    type: v.string(),
    description: v.optional(v.string()),
    socialLinks: v.object({
      website: v.optional(v.string()),
    }),
    vision: v.string(),
    mission: v.string(),
    principles: v.array(v.string()),
    values: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { companyId, ...updateData } = args;
    
    // Verify company exists
    const company = await ctx.db.get(companyId);
    if (!company) {
      throw new Error("Company not found");
    }

    // If there's a new storageId, delete the old one
    if (updateData.storageId && company.storageId && updateData.storageId !== company.storageId) {
      try {
        await ctx.storage.delete(company.storageId);
      } catch (error) {
        console.error('Failed to delete old image:', error);
      }
    }

    // Update company
    await ctx.db.patch(companyId, {
      ...updateData,
      updatedAt: Date.now(),
    });

    return companyId;
  },
});

export const getTask = query({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      return null;
    }

    // Get the company info
    const company = await ctx.db.get(task.companyId);
    
    // Get the checklist if it exists
    let checklist = null;
    if (task.checklistId) {
      checklist = await ctx.db.get(task.checklistId);
    }

    return {
      ...task,
      company: company ? {
        name: company.name,
        image: company.image
      } : null,
      checklist: checklist ? checklist.items : null
    };
  },
});

export const getTasksForCompanies = query({
  args: {},
  handler: async (ctx) => {
    // Get all companies first
    const companies = await ctx.db
      .query("companies")
      .filter(q => 
        q.and(
          q.neq(q.field("name"), "network-skool"),
          q.neq(q.field("name"), "gumroad"),
          q.neq(q.field("name"), "goose"),
          q.neq(q.field("name"), "js7ab633pye8k2g9987e53kdwh7dpd9a"),
          q.neq(q.field("name"), "js78mxz4163s6gbnxa4xtgnzcn7dq0dn"),
          q.neq(q.field("name"), "js789ftfb2cx06han5b87vh1197dpfr2")
        )
      )
      .collect();

    // Get tasks for all companies
    const tasks = await ctx.db
      .query("tasks")
      .collect();

    // Create a map of company ID to tasks
    const tasksByCompany = new Map();
    for (const company of companies) {
      tasksByCompany.set(
        company._id, 
        tasks.filter(task => task.companyId === company._id)
      );
    }

    return {
      companies,
      tasksByCompany: Object.fromEntries(tasksByCompany)
    };
  },
});

export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // Delete the task
    await ctx.db.delete(args.taskId);
    return true;
  },
});

export const createCompany = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    location: v.string(),
    image: v.string(),
    type: v.string(),
    color: v.optional(v.string()),
    adminId: v.string(),
    storageId: v.optional(v.string()),
    description: v.string(),
    socialLinks: v.object({
      website: v.optional(v.string()),
    }),
    vision: v.string(),
    mission: v.string(),
    principles: v.array(v.string()),
    values: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { color, type, storageId, ...otherFields } = args;
    
    const companyData = {
      ...otherFields,
      type,
      storageId,
      color: color ?? "#000000", // Default color if none provided
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const companyId = await ctx.db.insert("companies", companyData);
    return companyId;
  },
});

export const deleteCompanies = mutation({
  args: {
    companyIds: v.array(v.id("companies")),
  },
  handler: async (ctx, args) => {
    // Delete each company and its associated tasks
    for (const companyId of args.companyIds) {
      // Delete all tasks associated with this company
      const tasks = await ctx.db
        .query("tasks")
        .withIndex("by_company", (q) => q.eq("companyId", companyId))
        .collect();
      
      for (const task of tasks) {
        // Delete all submissions for this task
        const submissions = await ctx.db
          .query("submissions")
          .withIndex("by_task", (q) => q.eq("taskId", task._id))
          .collect();
        
        for (const submission of submissions) {
          await ctx.db.delete(submission._id);
        }
        
        // Delete the task
        await ctx.db.delete(task._id);
      }
      
      // Delete the company
      await ctx.db.delete(companyId);
    }
    
    return true;
  },
});