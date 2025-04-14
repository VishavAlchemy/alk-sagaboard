import { type Id } from "@/convex/_generated/dataModel";

export type AvatarProfile = {
  _id: Id<"avatarProfiles">;
  _creationTime: number;
  userId: string;
  profilePictureId?: string;
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