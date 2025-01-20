// import React, {
//     createContext,
//     useContext,
//     useEffect,
//     useState,
//     ReactNode,
//   } from "react";
//   import { supabase } from "@/utils/supabase";
//   import { useQueryClient } from "@tanstack/react-query";

//   // If you need to share any global state (like userId), you can store it here.
//   type SupabaseRealtimeContextType = {
//     userId: string | null;
//   };

//   const SupabaseRealtimeContext = createContext<SupabaseRealtimeContextType>({
//     userId: null,
//   });

//   export const SupabaseRealtimeProvider = ({ children }: { children: ReactNode }) => {
//     const [userId, setUserId] = useState<string | null>(null);
//     const queryClient = useQueryClient();

//     /**
//      * 1. Fetch the current user once. Then set up an onAuthStateChange listener
//      *    so we always know when user signs in/out.
//      */
//     useEffect(() => {
//       let authSubscription: any;

//       const getCurrentUser = async () => {
//         try {
//           const {
//             data: { user },
//           } = await supabase.auth.getUser();
//           setUserId(user?.id ?? null);
//         } catch (error) {
//           console.error("Error fetching user:", error);
//           setUserId(null);
//         }
//       };

//       // Fetch user on mount
//       getCurrentUser();

//       // Listen for changes (SIGN_IN, SIGN_OUT, TOKEN_REFRESH, etc.)
//       const {
//         data: { subscription },
//       } = supabase.auth.onAuthStateChange(async (event) => {
//         console.log("Auth event triggered:", event);
//         if (event === "SIGNED_OUT") {
//           setUserId(null);
//           // Optionally clear relevant queries
//           queryClient.removeQueries({ queryKey: ["questionsFromUser"] });
//         } else {
//           // SIGNED_IN or TOKEN_REFRESH
//           await getCurrentUser();
//         }
//       });

//       authSubscription = subscription;

//       return () => {
//         authSubscription?.unsubscribe?.();
//       };
//     }, [queryClient]);

//     /**
//      * 2. Once we have the userId, set up a channel for "user_question" changes.
//      *    We'll filter changes for just this user: `user_id=eq.${userId}`.
//      */
//     useEffect(() => {
//       if (!userId) return; // No subscription if not logged in

//       const userQuestionsChannel = supabase
//         .channel(`user_questions_${userId}`)
//         .on(
//           "postgres_changes",
//           {
//             event: "*", // (INSERT | UPDATE | DELETE)
//             schema: "public",
//             table: "user_question",
//             filter: `user_id=eq.${userId}`, // only changes for current user
//           },
//           async (payload) => {
//             console.log("user_question event:", payload.eventType, payload);
//             // Force React Query to refetch user questions (await so we know when it's done)
//             await queryClient.invalidateQueries({
//               queryKey: ["questionsFromUser", userId],
//               refetchType: "all", // or "active", "inactive", "none"
//             });
//           }
//         )
//         .subscribe();

//       return () => {
//         userQuestionsChannel.unsubscribe();
//       };
//     }, [userId, queryClient]);

//     /**
//      * 3. Subscribe to "news" table changes (no filter).
//      *    We invalidate the "news" query so the infinite list refetches.
//      */
//     useEffect(() => {
//       const newsChannel = supabase
//         .channel("news_changes")
//         .on(
//           "postgres_changes",
//           {
//             event: "*",
//             schema: "public",
//             table: "news",
//           },
//           async (payload) => {
//             console.log("news event:", payload.eventType, payload);
//             // Invalidate the "news" infinite query so it can refetch (await for consistency)
//             await queryClient.invalidateQueries({
//               queryKey: ["news"],
//               refetchType: "all",
//             });
//           }
//         )
//         .subscribe();

//       return () => {
//         newsChannel.unsubscribe();
//       };
//     }, [queryClient]);

//     /**
//      * 4. Finally, provide the userId (or any other data) to children.
//      */
//     return (
//       <SupabaseRealtimeContext.Provider value={{ userId }}>
//         {children}
//       </SupabaseRealtimeContext.Provider>
//     );
//   };

//   // Optional helper hook if you need direct access to `userId` or context data.
//   export const useSupabaseRealtime = () => useContext(SupabaseRealtimeContext);

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/utils/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { NewsItemType } from "@/hooks/useFetchNews";
import { userQuestionsNewAnswerForQuestions } from "@/constants/messages";
import { useAuthStore } from "@/stores/authStore";

type SupabaseRealtimeContextType = {
  userId: string | null;
  hasNewNewsData: boolean;
  clearNewNewsFlag: () => void;
};

const SupabaseRealtimeContext = createContext<SupabaseRealtimeContextType>({
  userId: null,
  hasNewNewsData: false,
  clearNewNewsFlag: () => {},
});

export const SupabaseRealtimeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [hasNewNewsData, setHasNewNewsData] = useState(false);
  const queryClient = useQueryClient();
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const clearNewNewsFlag = () => setHasNewNewsData(false);

  /**
   * Auth state management
   */
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUserId(user?.id ?? null);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserId(null);
      }
    };

    getCurrentUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      console.log("Auth event triggered:", event);
      if (event === "SIGNED_OUT") {
        setUserId(null);
        queryClient.removeQueries({ queryKey: ["questionsFromUser"] });
      } else {
        await getCurrentUser();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [queryClient]);

  /**
   * User questions subscription
   */
  useEffect(() => {
    if (!userId) return;

    const userQuestionsChannel = supabase
      .channel(`user_questions_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "user_question",
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          console.log("user_question event:", payload.eventType, payload);
          userQuestionsNewAnswerForQuestions();
          await queryClient.invalidateQueries({
            queryKey: ["questionsFromUser", userId],
            refetchType: "all",
          });
        }
      )
      .subscribe();

    return () => {
      userQuestionsChannel.unsubscribe();
    };
  }, [userId, queryClient]);

  /**
   * News subscription
   */
  useEffect(() => {
    const newsChannel = supabase
      .channel("news_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "news",
        },
        async (payload) => {
          console.log("news event:", payload.eventType, payload);
          if (isAdmin) {
            // For admin users, immediately invalidate and refetch
            await queryClient.invalidateQueries({
              queryKey: ["news"],
              refetchType: "all",
            });
          } else {
            // For non-admin users, show update button and update cache
            setHasNewNewsData(true);
            console.log("NO")

            if (
              payload.eventType === "INSERT" ||
              payload.eventType === "UPDATE"
            ) {
              const newItem = payload.new as NewsItemType;
              queryClient.setQueriesData<NewsItemType[]>(
                { queryKey: ["news"] },
                (oldData) => {
                  if (!oldData) return [newItem];
                  return [newItem, ...oldData];
                }
              );
            } else if (payload.eventType === "DELETE") {
              const deletedItem = payload.old as NewsItemType; // Get the deleted item
              queryClient.setQueriesData<NewsItemType[]>(
                { queryKey: ["news"] },
                (oldData) => {
                  if (!oldData) return []; // If cache is empty, return empty array
                  // Filter out the deleted item from the cached data
                  return oldData.filter((item) => item.id !== deletedItem.id);
                }
              );
            }
          }
        }
      )
      .subscribe();

    return () => {
      newsChannel.unsubscribe();
    };
  }, [queryClient]);

  return (
    <SupabaseRealtimeContext.Provider
      value={{
        userId,
        hasNewNewsData,
        clearNewNewsFlag,
      }}
    >
      {children}
    </SupabaseRealtimeContext.Provider>
  );
};

export const useSupabaseRealtime = () => useContext(SupabaseRealtimeContext);
