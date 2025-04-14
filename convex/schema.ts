import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { type Id } from "./_generated/dataModel";

export default defineSchema({
  users: defineTable({
    // Basic user info from auth provider
    email: v.string(),
    name: v.string(),
    avatarUrl: v.string(),
    clerkId: v.string(),
    
    // Payment integration
    stripeCustomerId: v.optional(v.string()),
    stripeConnectAccountId: v.optional(v.string()),
    stripeConnectCompleted: v.optional(v.boolean()),
    
    // Onboarding fields
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    username: v.optional(v.string()), // @username - must be unique
    age: v.optional(v.number()),
    archetypes: v.optional(v.array(v.string())),
    aboutMe: v.optional(v.string()),
    experience: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
    
    // Gallery images - array of URLs
    galleryImages: v.optional(v.array(v.string())),
    
    // Favorite books - array of book objects with cover URLs
    favoriteBooks: v.optional(v.array(v.object({
      coverUrl: v.string(),
      title: v.optional(v.string()),
    }))),
    
    // Project info
    project: v.optional(v.object({
      logoUrl: v.string(),
      headline: v.string(),
      subheadline: v.string(),
      link: v.string(),
    })),
    
    // Social/professional links
    links: v.optional(v.array(v.object({
      type: v.string(), // github, website, instagram, etc.
      url: v.string(),
      title: v.optional(v.string()),
    }))),
    
    // Flag to track if onboarding is complete
    onboardingComplete: v.optional(v.boolean()),

    // Add the new image fields
    profilePictureId: v.optional(v.string()),
    galleryImageIds: v.optional(v.array(v.string())),
    bookImageIds: v.optional(v.array(v.string())),
  }).index("by_clerk_id", ["clerkId"])
    .index("by_username", ["username"]),

  messages: defineTable({
    content: v.string(),
    senderId: v.string(),
    receiverId: v.string(),
    conversationId: v.string(),
    createdAt: v.number(),
    read: v.boolean(),
    // Optional: attachments, etc.
  }).index("by_conversation", ["conversationId", "createdAt"]),

  conversations: defineTable({
    participantIds: v.array(v.string()),
    lastMessageAt: v.number(),
    lastMessage: v.optional(v.string()),
    type: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_participants", ["participantIds"]),

  avatarProfiles: defineTable({
    userId: v.string(),
    profilePictureId: v.optional(v.string()),
    personalInfo: v.object({
      name: v.string(),
      role: v.string(),
      location: v.string(),
      image: v.string(),
      socialLinks: v.object({
        website: v.string(),
        github: v.string(),
        twitter: v.string(),
      }),
    }),
    experience: v.array(v.object({
      icon: v.string(),
      text: v.string(),
    })),
    skills: v.array(v.object({
      icon: v.string(),
      text: v.string(),
    })),
    aboutMe: v.object({
      aboutMe: v.string(),
      favoriteBooks: v.array(v.string()),
    }),
    projects: v.array(v.object({
      id: v.string(),
      title: v.string(),
      description: v.array(v.string()),
      date: v.optional(v.string()),
      color: v.string(),
    })),
  }).index("by_userId", ["userId"]),

  companies: defineTable({
    name: v.string(),
    role: v.string(),
    location: v.string(),
    image: v.string(),
    storageId: v.optional(v.string()),
    color: v.string(),
    type: v.optional(v.string()),
    adminId: v.optional(v.string()), // ID of the admin user
    description: v.optional(v.string()),
    socialLinks: v.object({
      website: v.optional(v.string()),
    }),
    vision: v.string(),
    mission: v.string(),
    principles: v.array(v.string()),
    values: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  tasks: defineTable({
    companyId: v.id("companies"),
    category: v.string(),
    text: v.string(),
    name: v.optional(v.string()),
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
    additionalInfo: v.optional(v.string()),
    checklistId: v.optional(v.id("checklists")),
    status: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    assignedTo: v.optional(v.id("users")),
  }).index("by_company", ["companyId"])
    .index("by_category", ["companyId", "category"])
    .index("by_status", ["companyId", "status"]),

  submissions: defineTable({
    taskId: v.id("tasks"),
    userId: v.string(),
    text: v.string(),
    url: v.optional(v.string()),
    fileId: v.optional(v.string()),
    fileName: v.optional(v.string()),
    status: v.string(), // "pending", "approved", "rejected"
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_task", ["taskId"])
    .index("by_user", ["userId"]),

  notifications: defineTable({
    userId: v.string(),
    type: v.string(), // "task_submission", "submission_approved", etc.
    title: v.string(),
    message: v.string(),
    read: v.boolean(),
    metadata: v.object({
      taskId: v.optional(v.id("tasks")),
      submissionId: v.optional(v.id("submissions")),
      companyId: v.optional(v.id("companies")),
    }),
    createdAt: v.number(),
  }).index("by_user", ["userId", "createdAt"]),

  checklists: defineTable({
    creatorId: v.string(), // adminId who created the checklist
    name: v.string(),
    items: v.array(v.object({
      id: v.string(),
      text: v.string(),
      completed: v.boolean(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_creator", ["creatorId"]),
}); 