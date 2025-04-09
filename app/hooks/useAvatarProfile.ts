import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { type AvatarProfile } from "../types/avatarProfile";

export const useAvatarProfile = () => {
  const { userId, isLoaded: isAuthLoaded } = useAuth();
  
  const profile = useQuery(api.avatarProfiles.get, {
    userId: userId || "",
  }) as AvatarProfile | null;

  const allProfiles = useQuery(api.avatarProfiles.getAll) as AvatarProfile[] | null;

  const createProfile = useMutation(api.avatarProfiles.create);
  const updateProfile = useMutation(api.avatarProfiles.update);

  return {
    profile,
    allProfiles,
    createProfile,
    updateProfile,
    isLoading: !isAuthLoaded || profile === undefined,
    isAllProfilesLoading: allProfiles === undefined,
    isAuthenticated: !!userId,
  };
}; 