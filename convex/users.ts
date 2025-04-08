import { mutation, query } from "./_generated/server";
import { v } from "convex/values";



export const store = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    avatarUrl: v.string(),
    clerkId: v.string(),
    stripeCustomerId: v.optional(v.string()),
    stripeConnectAccountId: v.optional(v.string()),
    stripeConnectCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
        // Check if user already exists
        const existingUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
        .first();
  
      if (existingUser) {
        return existingUser._id;
      }
    await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      avatarUrl: args.avatarUrl,
      clerkId: args.clerkId,
      stripeCustomerId: args.stripeCustomerId,
      stripeConnectAccountId: args.stripeConnectAccountId,
      stripeConnectCompleted: args.stripeConnectCompleted,
    });
  },
});


export const checkUser = query({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});


export const getUserIdByClerkId = query({
    args: { clerkId: v.string() },
    async handler(ctx, args) {
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
        .first();
      return user?._id; // Return the _id if user exists, otherwise undefined
    },
  });

export const getPersonalInfo = query({
  args: {},
  handler: async (ctx) => {
    const personalInfo = await ctx.db
      .query("users")
      .collect();
    return personalInfo;
  },
});

export const getCurrentUser = query({
  handler: async (ctx) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return null;
      
      return await ctx.db
          .query("users")
          .filter(q => q.eq(q.field("clerkId"), identity.tokenIdentifier))
          .unique();
  },
});

export const updateStripeConnectAccount = mutation({
  args: {
    clerkId: v.string(),
    stripeConnectAccountId: v.optional(v.string()),
    stripeConnectCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Update the user record with the Stripe Connect account ID
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkId"), args.clerkId))
      .first();
    if (!user) {
      throw new Error(`User with Clerk ID ${args.clerkId} not found`);
    }
    await ctx.db.patch(user._id, {
      stripeConnectAccountId: args.stripeConnectAccountId,
      stripeConnectCompleted: args.stripeConnectCompleted,
    });
  },
});

export const updateStripeConnectAccountByClerkId = mutation({
  args: {
    clerkId: v.string(),
    stripeConnectAccountId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Find the user by their Clerk ID
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (!user) {
      throw new Error(`User with Clerk ID ${args.clerkId} not found`);
    }

    // Update the user record with the Stripe Connect account ID
    await ctx.db.patch(user._id, {
      stripeConnectAccountId: args.stripeConnectAccountId,
    });

    return true;
  },
});

export const getUserStripeConnectAccountId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users").filter(q => q.eq(q.field("clerkId"), args.clerkId)).first();
    return user?.stripeConnectAccountId;
  },
});

export const getUserByStripeAccountId = query({
  args: { stripeAccountId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("stripeConnectAccountId"), args.stripeAccountId))
      .collect();
  },
});

export const updateUserStripeStatus = mutation({
  args: { 
    clerkId: v.string(),
    stripeConnectCompleted: v.boolean()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();
      
    if (!user) {
      throw new Error(`User with Clerk ID ${args.clerkId} not found`);
    }
    
    return await ctx.db.patch(user._id, {
      stripeConnectCompleted: args.stripeConnectCompleted
    });
  },
});

export const isUsernameAvailable = query({
  args: { username: v.string() },
  async handler(ctx, args) {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_username", q => q.eq("username", args.username))
      .first();
    
    return existingUser === null;
  },
});

export const updateOnboardingData = mutation({
  args: {
    clerkId: v.string(),
    username: v.string(),
    firstName: v.string(),
    age: v.number(),
    archetypes: v.array(v.string()),
    aboutMe: v.string(),
    experience: v.string(),
    interests: v.array(v.string()),
    galleryImages: v.array(v.string()),
    favoriteBooks: v.array(v.object({
      coverUrl: v.string(),
      title: v.optional(v.string()),
    })),
    project: v.object({
      logoUrl: v.string(),
      headline: v.string(),
      subheadline: v.string(),
      link: v.string(),
    }),
    links: v.array(v.object({
      type: v.string(),
      url: v.string(),
      title: v.optional(v.string()),
    })),
  },
  async handler(ctx, args) {
    // Find the user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", args.clerkId))
      .first();
    
    if (!user) {
      throw new Error(`User with Clerk ID ${args.clerkId} not found`);
    }
    
    // Check if username is already taken by another user
    const existingUserWithUsername = await ctx.db
      .query("users")
      .withIndex("by_username", q => q.eq("username", args.username))
      .first();
    
    if (existingUserWithUsername && existingUserWithUsername._id !== user._id) {
      throw new Error(`Username @${args.username} is already taken`);
    }
    
    // Update the user with all onboarding data
    await ctx.db.patch(user._id, {
      username: args.username,
      firstName: args.firstName,
      age: args.age,
      archetypes: args.archetypes,
      aboutMe: args.aboutMe,
      experience: args.experience,
      interests: args.interests,
      galleryImages: args.galleryImages,
      favoriteBooks: args.favoriteBooks,
      project: args.project,
      links: args.links,
      onboardingComplete: true,
    });
    
    return user._id;
  },
});

export const getUserProfile = query({
  args: { userId: v.string() },
  async handler(ctx, args) {
    // Find user by clerkId
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkId"), args.userId))
      .first();
    
    if (!user) {
      return null;
    }
    
    return {
      _id: user._id,
      _creationTime: user._creationTime,
      name: user.name,
      firstName: user.firstName,
      username: user.username || '@username',
      age: user.age?.toString() || '',
      occupation: user.archetypes?.join(', ') || '',
      country: 'canada', // Default value
      about: user.aboutMe || '',
      tagline: user.project?.headline || '',
      currentActivities: user.project?.subheadline || '',
      experience: user.experience || '',
      projectsExperience: user.project?.link || '',
      interests: user.interests || ['Technology'],
      links: user.links || [],
      profilePictureId: user.profilePictureId || '',
      galleryImageIds: user.galleryImageIds || [],
      bookImageIds: user.bookImageIds || [],
      project: user.project || '',
    };
  },
});

export const createUser = mutation({
  args: {
    userId: v.string(),
    firstName: v.string(),
    name: v.string(),
    username: v.string(),
    age: v.string(),
    occupation: v.string(),
    country: v.string(),
    about: v.string(),
    tagline: v.string(),
    currentActivities: v.string(),
    experience: v.string(),
    projectsExperience: v.string(),
    interests: v.array(v.string()),
    links: v.array(v.object({
      type: v.string(),
      url: v.string(),
      title: v.optional(v.string()),
    })),
    projects: v.array(v.object({
      name: v.string(),
      shortDescription: v.string(),
      detailedDescription: v.string(),
      url: v.string(),
    })),
    profilePictureId: v.optional(v.string()),
    galleryImageIds: v.optional(v.array(v.string())),
    bookImageIds: v.optional(v.array(v.string())),
  },
  async handler(ctx, args) {
    // Find existing user
    const existingUser = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkId"), args.userId))
      .first();
    
    if (existingUser) {
      // User exists, update their profile
      return await ctx.db.patch(existingUser._id, {
        username: args.username.replace('@', ''),
        age: parseInt(args.age) || undefined,
        firstName: args.firstName,
        aboutMe: args.about,
        experience: args.experience,
        interests: args.interests,
        archetypes: [args.occupation],
        project: args.projects.length > 0 ? {
          logoUrl: "", // This would be handled separately with file uploads
          headline: args.tagline,
          subheadline: args.currentActivities,
          link: args.projectsExperience,
        } : undefined,
        links: args.links,
        // Add image IDs to the database record
        profilePictureId: args.profilePictureId,
        galleryImageIds: args.galleryImageIds || [],
        bookImageIds: args.bookImageIds || [],
        onboardingComplete: true,
      });
    } else {
      throw new Error("User not found. Please create an account first.");
    }
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.string(),
    firstName: v.string(),
    username: v.string(),
    age: v.string(),
    occupation: v.string(),
    country: v.string(),
    about: v.string(),
    tagline: v.string(),
    currentActivities: v.string(),
    experience: v.string(),
    projectsExperience: v.string(),
    interests: v.array(v.string()),
    links: v.array(v.object({
      type: v.string(),
      url: v.string(),
      title: v.optional(v.string()),
    })),
    projects: v.array(v.object({
      name: v.string(),
      shortDescription: v.string(),
      detailedDescription: v.string(),
      url: v.string(),
    })),
    profilePictureId: v.optional(v.string()),
    galleryImageIds: v.optional(v.array(v.string())),
    bookImageIds: v.optional(v.array(v.string())),
  },
  async handler(ctx, args) {
    // Update existing user profile
    return await ctx.db.patch(args.id, {
      username: args.username.replace('@', ''),
      age: parseInt(args.age) || undefined,
      aboutMe: args.about,
      experience: args.experience,
      firstName: args.firstName,
      interests: args.interests,
      archetypes: [args.occupation],
      project: args.projects.length > 0 ? {
        logoUrl: "", // This would be handled separately with file uploads
        headline: args.tagline,
        subheadline: args.currentActivities,
        link: args.projectsExperience,
      } : undefined,
      links: args.links,
      onboardingComplete: true,
    });
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

export const updateUserProfile = mutation({
  args: {
    firstName: v.optional(v.string()),
    username: v.optional(v.string()),
    age: v.optional(v.string()),
    occupation: v.optional(v.string()),
    about: v.optional(v.string()),
    experience: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
    links: v.optional(v.array(v.object({
      url: v.string(),
      title: v.optional(v.string()),
      type: v.optional(v.string()),
    }))),
    profilePictureId: v.optional(v.string()),
    galleryImageIds: v.optional(v.array(v.string())),
    bookImageIds: v.optional(v.array(v.string())),
    project: v.optional(v.object({
      logoUrl: v.string(),
      headline: v.string(),
      subheadline: v.string(),
      link: v.string(),
    })),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    console.log("Identity:", JSON.stringify(identity));
    const clerkId = identity.tokenIdentifier.split("|")[1] || identity.tokenIdentifier;
    console.log("Using clerkId:", clerkId);
    
    // Find the user - try multiple approaches
    let user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkId"), clerkId))
      .first();
    
    // If user not found, try a broader search to debug
    if (!user) {
      console.log("User not found with direct clerkId match, trying alternative methods");
      // Try to find user by substring match
      const allUsers = await ctx.db.query("users").collect();
      console.log("All users:", JSON.stringify(allUsers.map(u => ({ id: u._id, clerkId: u.clerkId }))));
      
      // Try alternative identity formats
      if (identity.tokenIdentifier.includes("|")) {
        const [provider, id] = identity.tokenIdentifier.split("|");
        user = await ctx.db
          .query("users")
          .filter(q => q.eq(q.field("clerkId"), id))
          .first();
      }
    }
    
    if (!user) {
      throw new Error("User not found after multiple lookup attempts");
    }
    
    console.log("Found user:", JSON.stringify({ id: user._id, clerkId: user.clerkId }));
    
    // Rest of function unchanged
    // Check if username is changing and if it's already taken
    if (args.username && args.username !== user.username) {
      const existingUserWithUsername = await ctx.db
        .query("users")
        .withIndex("by_username", q => q.eq("username", args.username))
        .first();
      
      if (existingUserWithUsername && existingUserWithUsername._id !== user._id) {
        throw new Error(`Username @${args.username} is already taken`);
      }
    }
    
    // Build update object with only the fields that were provided
    const updateData: any = {};
    
    if (args.firstName !== undefined) updateData.firstName = args.firstName;
    if (args.username !== undefined) updateData.username = args.username.replace('@', '');
    if (args.age !== undefined) updateData.age = parseInt(args.age) || undefined;
    if (args.occupation !== undefined) updateData.archetypes = [args.occupation];
    if (args.about !== undefined) updateData.aboutMe = args.about;
    if (args.experience !== undefined) updateData.experience = args.experience;
    if (args.interests !== undefined) updateData.interests = args.interests;
    if (args.links !== undefined) updateData.links = args.links;
    if (args.profilePictureId !== undefined) updateData.profilePictureId = args.profilePictureId;
    if (args.galleryImageIds !== undefined) updateData.galleryImageIds = args.galleryImageIds;
    if (args.bookImageIds !== undefined) updateData.bookImageIds = args.bookImageIds;
    if (args.project !== undefined) updateData.project = args.project;
    
    // Update the user
    return await ctx.db.patch(user._id, updateData);
  },
});

