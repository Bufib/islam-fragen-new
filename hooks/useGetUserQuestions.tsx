// // types.ts
// export type QuestionFromUser = {
//   id: string;
//   user_id: string;
//   question_text: string;
//   answer_text?: string;
//   status: "Beantworted." | "Beantwortung steht noch aus." | "Abgelehnt.";
//   marja: string;
//   title: string;
//   created_at: string;
// };

// export type AskQuestionFormData = {
//   title: string;
//   question_text: string;
//   marja: string;
// };
// import { supabase } from "@/utils/supabase";
// import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
// import { useEffect } from "react";

// const QUESTIONS_PER_PAGE = 5;

// export const questionsQuery = (pageParam = 0) => ({
//   queryKey: ["questionsFromUser", pageParam] as const,
//   queryFn: async () => {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) throw new Error("Not authenticated");

//     const from = pageParam * QUESTIONS_PER_PAGE;
//     const to = from + QUESTIONS_PER_PAGE - 1;

//     const { data, error, count } = await supabase
//       .from("user_question")
//       .select("*", { count: "exact" })
//       .eq("user_id", user.id)
//       .order("created_at", { ascending: false })
//       .range(from, to);

//     if (error) throw error;

//     return {
//       questions: data || [],
//       nextPage: to < (count || 0) - 1 ? pageParam + 1 : undefined,
//       totalCount: count,
//     };
//   },
// });

// export const useGetUserQuestions = () => {
//   const queryClient = useQueryClient();

//   // Set up real-time subscription
//   useEffect(() => {
//     const getUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) return;

//       // Subscribe to changes on user's questions
//       const subscription = supabase
//         .channel('user_questions_changes')
//         .on(
//           'postgres_changes',
//           {
//             event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
//             schema: 'public',
//             table: 'user_question',
//             filter: `user_id=eq.${user.id}`,
//           },
//           async (payload) => {
//             // Handle different types of changes
//             switch (payload.eventType) {
//               case 'INSERT':
//                 // Invalidate the query to refetch with new data
//                 queryClient.invalidateQueries({ 
//                   queryKey: ['questionsFromUser']
//                 });
//                 break;

//               case 'UPDATE': {
//                 // Update the specific question in cache
//                 const newQuestion = payload.new as QuestionFromUser;
//                 queryClient.setQueriesData(
//                   { queryKey: ['questionsFromUser'] },
//                   (oldData: any) => {
//                     if (!oldData) return oldData;
//                     return {
//                       ...oldData,
//                       pages: oldData.pages.map((page: any) => ({
//                         ...page,
//                         questions: page.questions.map((q: QuestionFromUser) =>
//                           q.id === newQuestion.id ? newQuestion : q
//                         ),
//                       })),
//                     };
//                   }
//                 );
//                 break;
//               }

//               case 'DELETE':
//                 // Remove the deleted question from cache
//                 const deletedId = payload.old.id;
//                 queryClient.setQueriesData(
//                   { queryKey: ['questionsFromUser'] },
//                   (oldData: any) => {
//                     if (!oldData) return oldData;
//                     return {
//                       ...oldData,
//                       pages: oldData.pages.map((page: any) => ({
//                         ...page,
//                         questions: page.questions.filter(
//                           (q: QuestionFromUser) => q.id !== deletedId
//                         ),
//                       })),
//                     };
//                   }
//                 );
//                 break;
//             }
//           }
//         )
//         .subscribe();

//       // Cleanup subscription on unmount
//       return () => {
//         subscription.unsubscribe();
//       };
//     };

//     getUser();
//   }, [queryClient]);

//   return useInfiniteQuery({
//     ...questionsQuery(),
//     initialPageParam: 0,
//     getNextPageParam: (lastPage) => lastPage.nextPage,
//     gcTime: 1000 * 60 * 30, // 30 minutes cache
//     staleTime: 1000 * 60 * 5, // 5 minutes before refetch
//   });
// };



// export type QuestionFromUser = {
//   id: string;
//   user_id: string;
//   question_text: string;
//   answer_text?: string;
//   status: "Beantwortet." | "Beantwortung steht noch aus." | "Abgelehnt.";
//   marja: string;
//   title: string;
//   created_at: string;
// };

// export type AskQuestionFormData = {
//   title: string;
//   question_text: string;
//   marja: string;
// };
// import { supabase } from "@/utils/supabase";
// import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
// import { useEffect } from "react";


// const QUESTIONS_PER_PAGE = 5;

// export const useGetUserQuestions = () => {
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     const initSubscription = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return;

//       const subscription = supabase
//         .channel("user_questions_changes")
//         .on(
//           "postgres_changes",
//           {
//             event: "*",
//             schema: "public",
//             table: "user_question",
//             filter: `user_id=eq.${user.id}`,
//           },
//           async (payload) => {
//             switch (payload.eventType) {
//               case "INSERT": {
//                 // Instead of invalidating, we'll insert the new question at the top
//                 const newQuestion = payload.new as QuestionFromUser;
//                 queryClient.setQueriesData(
//                   { queryKey: ["questionsFromUser"] },
//                   (oldData: any) => {
//                     if (!oldData?.pages?.[0]) return oldData;
                    
//                     // Add to the first page and maintain QUESTIONS_PER_PAGE limit
//                     const updatedFirstPage = {
//                       ...oldData.pages[0],
//                       questions: [newQuestion, ...oldData.pages[0].questions].slice(0, QUESTIONS_PER_PAGE),
//                     };

//                     return {
//                       ...oldData,
//                       pages: [
//                         updatedFirstPage,
//                         ...oldData.pages.slice(1).map(page => ({
//                           ...page,
//                           // Shift questions in subsequent pages
//                           questions: page.questions.map((_, index) => 
//                             index === 0 ? 
//                               oldData.pages[oldData.pages.indexOf(page) - 1].questions[QUESTIONS_PER_PAGE - 1] : 
//                               page.questions[index - 1]
//                           )
//                         }))
//                       ],
//                     };
//                   }
//                 );
//                 break;
//               }
//               case "UPDATE": {
//                 const newQuestion = payload.new as QuestionFromUser;
//                 queryClient.setQueriesData(
//                   { queryKey: ["questionsFromUser"] },
//                   (oldData: any) => {
//                     if (!oldData) return oldData;
//                     return {
//                       ...oldData,
//                       pages: oldData.pages.map((page: any) => ({
//                         ...page,
//                         questions: page.questions.map((q: QuestionFromUser) =>
//                           q.id === newQuestion.id ? newQuestion : q
//                         ),
//                       })),
//                     };
//                   }
//                 );
//                 break;
//               }
//               case "DELETE": {
//                 const deletedId = payload.old.id;
//                 queryClient.setQueriesData(
//                   { queryKey: ["questionsFromUser"] },
//                   (oldData: any) => {
//                     if (!oldData) return oldData;
//                     return {
//                       ...oldData,
//                       pages: oldData.pages.map((page: any) => ({
//                         ...page,
//                         questions: page.questions.filter(
//                           (q: QuestionFromUser) => q.id !== deletedId
//                         ),
//                       })),
//                     };
//                   }
//                 );
//                 break;
//               }
//             }
//           }
//         )
//         .subscribe();

//       return () => {
//         subscription.unsubscribe();
//       };
//     };

//     initSubscription();
//   }, [queryClient]);

//   return useInfiniteQuery({
//     queryKey: ["questionsFromUser"],
//     queryFn: async ({ pageParam = 0 }) => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) throw new Error("Not authenticated");

//       const from = pageParam * QUESTIONS_PER_PAGE;
//       const to = from + QUESTIONS_PER_PAGE - 1;

//       const { data, error, count } = await supabase
//         .from("user_question")
//         .select("*", { count: "exact" })
//         .eq("user_id", user.id)
//         .order("created_at", { ascending: false })
//         .range(from, to);

//       if (error) throw error;

//       return {
//         questions: data || [],
//         nextPage: to < (count || 0) - 1 ? pageParam + 1 : undefined,
//         totalCount: count,
//       };
//     },
//     initialPageParam: 0,
//     getNextPageParam: (lastPage) => lastPage.nextPage,
//     staleTime: 1000 * 60 * 5,  // 5 minutes
//     gcTime: 1000 * 60 * 30,    // 30 minutes
//   });
// };

// export type QuestionFromUser = {
//   id: string;
//   user_id: string;
//   question_text: string;
//   answer_text?: string;
//   status: "Beantwortet." | "Beantwortung steht noch aus." | "Abgelehnt.";
//   marja: string;
//   title: string;
//   created_at: string;
// };

// export type AskQuestionFormData = {
//   title: string;
//   question_text: string;
//   marja: string;
// };

// import { supabase } from "@/utils/supabase";
// import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
// import { useEffect, useState } from "react";

// const QUESTIONS_PER_PAGE = 5;

// export const useGetUserQuestions = () => {
//   const queryClient = useQueryClient();
//   const [userId, setUserId] = useState<string | null>(null);

//   // Get current user and reset cache if user changes
//   useEffect(() => {
//     const getCurrentUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (user?.id !== userId) {
//         setUserId(user?.id || null);
//         // Reset cache when user changes
//         queryClient.removeQueries({ queryKey: ["questionsFromUser"] });
//       }
//     };

//     getCurrentUser();

//     // Listen for auth state changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(async () => {
//       getCurrentUser();
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [queryClient]);

//   useEffect(() => {
//     if (!userId) return;

//     const subscription = supabase
//       .channel("user_questions_changes")
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "user_question",
//           filter: `user_id=eq.${userId}`,
//         },
//         async (payload) => {
//           switch (payload.eventType) {
//             case "INSERT": {
//               const newQuestion = payload.new as QuestionFromUser;
//               queryClient.setQueriesData(
//                 { queryKey: ["questionsFromUser", userId] },
//                 (oldData: any) => {
//                   if (!oldData?.pages?.[0]) return oldData;
                  
//                   const updatedFirstPage = {
//                     ...oldData.pages[0],
//                     questions: [newQuestion, ...oldData.pages[0].questions].slice(0, QUESTIONS_PER_PAGE),
//                   };

//                   return {
//                     ...oldData,
//                     pages: [
//                       updatedFirstPage,
//                       ...oldData.pages.slice(1).map(page => ({
//                         ...page,
//                         questions: page.questions.map((_, index) => 
//                           index === 0 ? 
//                             oldData.pages[oldData.pages.indexOf(page) - 1].questions[QUESTIONS_PER_PAGE - 1] : 
//                             page.questions[index - 1]
//                         )
//                       }))
//                     ],
//                   };
//                 }
//               );
//               break;
//             }
//             case "UPDATE": {
//               const newQuestion = payload.new as QuestionFromUser;
//               queryClient.setQueriesData(
//                 { queryKey: ["questionsFromUser", userId] },
//                 (oldData: any) => {
//                   if (!oldData) return oldData;
//                   return {
//                     ...oldData,
//                     pages: oldData.pages.map((page: any) => ({
//                       ...page,
//                       questions: page.questions.map((q: QuestionFromUser) =>
//                         q.id === newQuestion.id ? newQuestion : q
//                       ),
//                     })),
//                   };
//                 }
//               );
//               break;
//             }
//             case "DELETE": {
//               const deletedId = payload.old.id;
//               queryClient.setQueriesData(
//                 { queryKey: ["questionsFromUser", userId] },
//                 (oldData: any) => {
//                   if (!oldData) return oldData;
//                   return {
//                     ...oldData,
//                     pages: oldData.pages.map((page: any) => ({
//                       ...page,
//                       questions: page.questions.filter(
//                         (q: QuestionFromUser) => q.id !== deletedId
//                       ),
//                     })),
//                   };
//                 }
//               );
//               break;
//             }
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [queryClient, userId]);

//   return useInfiniteQuery({
//     queryKey: ["questionsFromUser", userId],
//     queryFn: async ({ pageParam = 0 }) => {
//       if (!userId) throw new Error("Not authenticated");

//       const from = pageParam * QUESTIONS_PER_PAGE;
//       const to = from + QUESTIONS_PER_PAGE - 1;

//       const { data, error, count } = await supabase
//         .from("user_question")
//         .select("*", { count: "exact" })
//         .eq("user_id", userId)
//         .order("created_at", { ascending: false })
//         .range(from, to);

//       if (error) throw error;

//       return {
//         questions: data || [],
//         nextPage: to < (count || 0) - 1 ? pageParam + 1 : undefined,
//         totalCount: count,
//       };
//     },
//     initialPageParam: 0,
//     getNextPageParam: (lastPage) => lastPage.nextPage,
//     enabled: !!userId, // Only run query when we have a userId
//     staleTime: 1000 * 60 * 5,  // 5 minutes
//     gcTime: 1000 * 60 * 30,    // 30 minutes
//   });
// };

import { useEffect, useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";

// Define the structure of a question in your database
export type QuestionFromUser = {
  id: string;
  user_id: string;
  question_text: string;
  answer_text?: string;
  status: "Beantwortet." | "Beantwortung steht noch aus." | "Abgelehnt.";
  marja: string;
  title: string;
  created_at: string;
};

// Define the structure for asking a question
export type AskQuestionFormData = {
  title: string;
  question_text: string;
  marja: string;
};

const QUESTIONS_PER_PAGE = 5;

export const useGetUserQuestions = () => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch the current user and reset cache if the user changes
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id !== userId) {
        setUserId(user?.id || null);
        // Reset the cache when the user changes
        queryClient.removeQueries({ queryKey: ["questionsFromUser"] });
      }
    };

    getCurrentUser();

    // Listen for authentication state changes (login/logout, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      getCurrentUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, userId]);

  // Set up a subscription to listen for changes in the "user_question" table for this user
  useEffect(() => {
    if (!userId) return;

    const subscription = supabase
      .channel("user_questions_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_question",
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          switch (payload.eventType) {
            case "INSERT": {
              const newQuestion = payload.new as QuestionFromUser;
              queryClient.setQueriesData(
                { queryKey: ["questionsFromUser", userId] },
                (oldData: any) => {
                  if (!oldData?.pages?.[0]) return oldData;

                  // Insert the new question at the top of the first page
                  const updatedFirstPage = {
                    ...oldData.pages[0],
                    questions: [
                      newQuestion,
                      ...oldData.pages[0].questions,
                    ].slice(0, QUESTIONS_PER_PAGE),
                  };

                  // Shift items in subsequent pages to make room for the inserted question at the top
                  return {
                    ...oldData,
                    pages: [
                      updatedFirstPage,
                      ...oldData.pages.slice(1).map((page: any, pageIndex: number) => ({
                        ...page,
                        questions: page.questions.map((_: any, index: number) =>
                          index === 0
                            ? oldData.pages[pageIndex].questions[QUESTIONS_PER_PAGE - 1]
                            : page.questions[index - 1]
                        ),
                      })),
                    ],
                  };
                }
              );
              break;
            }
            case "UPDATE": {
              const updatedQuestion = payload.new as QuestionFromUser;
              queryClient.setQueriesData(
                { queryKey: ["questionsFromUser", userId] },
                (oldData: any) => {
                  if (!oldData) return oldData;

                  // Replace the updated question in whichever page it appears
                  return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                      ...page,
                      questions: page.questions.map((q: QuestionFromUser) =>
                        q.id === updatedQuestion.id ? updatedQuestion : q
                      ),
                    })),
                  };
                }
              );
              break;
            }
            case "DELETE": {
              const deletedId = payload.old.id;
              queryClient.setQueriesData(
                { queryKey: ["questionsFromUser", userId] },
                (oldData: any) => {
                  if (!oldData) return oldData;

                  // Remove the deleted question from all pages
                  return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                      ...page,
                      questions: page.questions.filter(
                        (q: QuestionFromUser) => q.id !== deletedId
                      ),
                    })),
                  };
                }
              );
              break;
            }
          }
        }
      )
      .subscribe();

    // Cleanup the subscription when the component unmounts or userId changes
    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, userId]);

  // Use React Query's infinite query to fetch pages of questions
  return useInfiniteQuery({
    queryKey: ["questionsFromUser", userId],
    queryFn: async ({ pageParam = 0 }) => {
      if (!userId) throw new Error("Not authenticated");

      const from = pageParam * QUESTIONS_PER_PAGE;
      const to = from + QUESTIONS_PER_PAGE - 1;

      // Fetch questions for the current user, with pagination
      const { data, error, count } = await supabase
        .from("user_question")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        questions: data || [],
        nextPage: to < (count || 0) - 1 ? pageParam + 1 : undefined,
        totalCount: count,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!userId, // Only run query when user is authenticated
    staleTime: 1000 * 60 * 5,  // 5 minutes
    gcTime: 1000 * 60 * 30,    // 30 minutes
  });
};
