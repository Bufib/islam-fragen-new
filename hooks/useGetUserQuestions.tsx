import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";

export type QuestionFromUser = {
  id: string;
  user_id: string;
  question: string;
  answer?: string;
  status: "Beantwortet" | "Beantwortung steht noch aus" | "Abgelehnt";
  marja: string;
  title: string;
  created_at: string;
};

export type AskQuestionFormData = {
  title: string;
  question: string;
  marja: string;
};

export const useGetUserQuestions = () => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  //
  // 1. Fetch the current user once, and set up an auth state listener
  //
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        console.log("Supabase user fetched:", user?.id);
        setUserId(user?.id ?? null);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserId(null);
      } finally {
        setIsInitializing(false);
      }
    };

    getCurrentUser();

    // Listen for sign-in / sign-out events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      console.log("Auth event triggered:", event);
      if (event === "SIGNED_OUT") {
        setUserId(null);
        queryClient.removeQueries({ queryKey: ["questionsFromUser"] });
      } else {
        getCurrentUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  //
  // 2. Set up real-time subscription to invalidate the query on any DB changes
  //
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`user_questions_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_question",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // Invalidate so TanStack Query re-fetches
          queryClient.invalidateQueries({
            queryKey: ["questionsFromUser", userId],
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient, userId]);

  //
  // 3. Fetch all questions using a simple useQuery (no pagination)
  //
  const queryResult = useQuery({
    queryKey: ["questionsFromUser", userId],
    queryFn: async () => {
      if (!userId) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_question")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data ?? [];
    },
    enabled: !isInitializing && !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    isInitializing,
  };
};
