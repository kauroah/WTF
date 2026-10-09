import { useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/api/supabaseClient";
import { useAuth } from "@/lib/AuthContext";

export function useProfileSave() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return async (profileId, data) => {
    if (!user?.id) {
      throw new Error("You must be authenticated to save a profile.");
    }

    let saved;

    if (profileId) {
      // Update existing profile
      const { data: updatedProfile, error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", profileId)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      saved = updatedProfile;
    } else {
      // Create new profile
      const { data: createdProfile, error } = await supabase
        .from("profiles")
        .insert({
          ...data,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      saved = createdProfile;
    }

    // Refresh cached profile/creator data
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["my-profile"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["creators"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["creator"],
      }),
    ]);

    return saved;
  };
}