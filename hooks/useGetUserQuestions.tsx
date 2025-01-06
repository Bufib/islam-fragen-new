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

export type AskQuestionFormData = {
  title: string;
  question_text: string;
  marja: string;
};
import { supabase } from "@/utils/supabase";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";


const QUESTIONS_PER_PAGE = 5;

export const useGetUserQuestions = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const initSubscription = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const subscription = supabase
        .channel("user_questions_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "user_question",
            filter: `user_id=eq.${user.id}`,
          },
          async (payload) => {
            switch (payload.eventType) {
              case "INSERT": {
                // Instead of invalidating, we'll insert the new question at the top
                const newQuestion = payload.new as QuestionFromUser;
                queryClient.setQueriesData(
                  { queryKey: ["questionsFromUser"] },
                  (oldData: any) => {
                    if (!oldData?.pages?.[0]) return oldData;
                    
                    // Add to the first page and maintain QUESTIONS_PER_PAGE limit
                    const updatedFirstPage = {
                      ...oldData.pages[0],
                      questions: [newQuestion, ...oldData.pages[0].questions].slice(0, QUESTIONS_PER_PAGE),
                    };

                    return {
                      ...oldData,
                      pages: [
                        updatedFirstPage,
                        ...oldData.pages.slice(1).map(page => ({
                          ...page,
                          // Shift questions in subsequent pages
                          questions: page.questions.map((_, index) => 
                            index === 0 ? 
                              oldData.pages[oldData.pages.indexOf(page) - 1].questions[QUESTIONS_PER_PAGE - 1] : 
                              page.questions[index - 1]
                          )
                        }))
                      ],
                    };
                  }
                );
                break;
              }
              case "UPDATE": {
                const newQuestion = payload.new as QuestionFromUser;
                queryClient.setQueriesData(
                  { queryKey: ["questionsFromUser"] },
                  (oldData: any) => {
                    if (!oldData) return oldData;
                    return {
                      ...oldData,
                      pages: oldData.pages.map((page: any) => ({
                        ...page,
                        questions: page.questions.map((q: QuestionFromUser) =>
                          q.id === newQuestion.id ? newQuestion : q
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
                  { queryKey: ["questionsFromUser"] },
                  (oldData: any) => {
                    if (!oldData) return oldData;
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

      return () => {
        subscription.unsubscribe();
      };
    };

    initSubscription();
  }, [queryClient]);

  return useInfiniteQuery({
    queryKey: ["questionsFromUser"],
    queryFn: async ({ pageParam = 0 }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const from = pageParam * QUESTIONS_PER_PAGE;
      const to = from + QUESTIONS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from("user_question")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
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
    staleTime: 1000 * 60 * 5,  // 5 minutes
    gcTime: 1000 * 60 * 30,    // 30 minutes
  });
};