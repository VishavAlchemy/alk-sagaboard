import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { type Id } from "./_generated/dataModel";

// Type for the avatar profile data
export type AvatarProfile = {
  userId: string;
  personalInfo: {
    name: string;
    role: string;
    location: string;
    image: string;
    socialLinks: {
      website: string;
      github: string;
      twitter: string;
    };
  };
  experience: Array<{
    icon: string;
    text: string;
  }>;
  skills: Array<{
    icon: string;
    text: string;
  }>;
  aboutMe: {
    aboutMe: string;
    favoriteBooks: string[];
  };
  projects: Array<{
    id: string;
    title: string;
    description: string[];
    date?: string;
    color: string;
  }>;
};

// Create a new avatar profile
export const create = mutation({
  args: {
    userId: v.string(),
    profile: v.any(), // We'll validate the shape in the function
  },
  handler: async (ctx, args) => {
    // Validate the profile data structure
    const profile = args.profile as AvatarProfile;
    
    // Check if profile already exists for this user
    const existingProfile = await ctx.db
      .query("avatarProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existingProfile) {
      throw new Error("Profile already exists for this user");
    }

    // Create the profile
    const profileId = await ctx.db.insert("avatarProfiles", {
      userId: args.userId,
      personalInfo: profile.personalInfo,
      experience: profile.experience,
      skills: profile.skills,
      aboutMe: profile.aboutMe,
      projects: profile.projects
    });

    return profileId;
  },
});

// Get avatar profile by userId
export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("avatarProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    return profile;
  },
});

// Update avatar profile
export const update = mutation({
  args: {
    userId: v.string(),
    profile: v.any(), // We'll validate the shape in the function
  },
  handler: async (ctx, args) => {
    const profile = args.profile as AvatarProfile;
    
    // Find the existing profile
    const existingProfile = await ctx.db
      .query("avatarProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!existingProfile) {
      throw new Error("Profile not found");
    }

    // Update the profile
    await ctx.db.patch(existingProfile._id, {
      ...profile,
    });

    return existingProfile._id;
  },
});

// Get all avatar profiles
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db
      .query("avatarProfiles")
      .collect();
    
    return profiles;
  },
});

// Seed initial data
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Example seed data - you can modify this with your actual data
    const seedData: AvatarProfile = {
      userId: "example-user-id", // Replace with actual user ID
      personalInfo: {
        name: "Vishav",
        role: "Brand Builder @SagaCity",
        location: "Laval QC",
        image: "/profilev1/pp.svg",
        socialLinks: {
          website: "https://vishavdheer.com",
          github: "https://github.com/vishavalchemy",
          twitter: "https://twitter.com/vishavecom"
        }
      },
      experience: [
        {
          icon: "orange",
          text: "Founder: Built eCom brands to 5250+ customers, coached eCom builders."
        },
        {
          icon: "blue",
          text: "Marketer: Ran advertisements for 12+ digital brands 6-7 figures in revenue (Popeyes, Nomnom, etc)."
        },
        {
          icon: "green",
          text: "Programmer: Built 10+ webapps & learning to code for last 5 months - To help with focus, meditation, learning."
        },
        {
          icon: "purple",
          text: "Purpose: Exploring the world of learning, mind & meditation for the last 10 years. Coached 10+ creators on their journey."
        }
      ],
      skills: [
        {
          icon: "orange",
          text: "Fullstack Development"
        },
        {
          icon: "blue",
          text: "Design"
        },
        {
          icon: "green",
          text: "Advertising (Tiktok, Meta, Google, etc)"
        },
        {
          icon: "purple",
          text: "Purpose"
        },
        {
          icon: "orange",
          text: "Creative Minded"
        },
        {
          icon: "blue",
          text: "Startups"
        }
      ],
      aboutMe: {
        aboutMe: "I've been programming for the past 6 months.",
        favoriteBooks: [
          "Alchemist",
          "Good to Great",
          "Surrender Experiment",
          "Jonathan Livingston Seagull"
        ]
      },
      projects: [
        {
          id: "aw",
          title: "eCom Brand Builder",
          description: [
            "- At AW, sold animewear, took brand from 0 to $50kMRR with Digital Ads",
            "- At SHN, coached 6+ eCom founders to make their first dollar online",
            "- At J7, helped 12+ brands with their advertising @Meta, @Tiktok & Google (Nomnom, Popeyes, MXK & more...)"
          ],
          date: "February 2022 - February 2024",
          color: "orange"
        },
        {
          id: "alchemy",
          title: "Community Builder",
          description: [
            "- At Straw Hat Nomads, led community for young entrepreneurs",
            "- At Alchemy, hosted 5+ workshops in physical creative space, 20+ members"
          ],
          date: "April 2024 - September 2024",
          color: "blue"
        },
        {
          id: "nextjs",
          title: "Software Developer",
          description: [
            "- Built 5+ Full Stack Apps (focus, learning & social apps)",
            "- Built 3 IOS App with Expo",
            "- Currently building digital infrastructure for SagaCity"
          ],
          date: "September 2024 - Present",
          color: "green"
        },
        {
          id: "vecom",
          title: "Purpose & Meditation",
          description: [
            "- Meditation for 10+ years",
            "- Travelled at Bangalore, SF, LA, Toronto, Quebec for spiritual retreats",
            "- Read 20+ books on purpose, meditation, spirituality, etc"
          ],
          color: "purple"
        }
      ]
    };

    // Create the profile
    const profileId = await ctx.db.insert("avatarProfiles", seedData);
    return profileId;
  },
}); 