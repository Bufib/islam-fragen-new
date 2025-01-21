// import { useState, useEffect } from "react";
// import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
// import { supabase } from "@/utils/supabase";

// export type NewsItemType = {
//   id: number;
//   created_at: string;
//   title?: string;
//   body_text?: string;
//   image_url?: string[];
//   external_url?: string[];
//   internal_url?: string[];
//   is_pinned?: boolean;
// };

// const PAGE_SIZE = 5;
// const MAX_PAGES = 4; // This will store up to 20 news items (4 pages * 5 items)

// export const useFetchNews = () => {
//   const queryClient = useQueryClient();
//   const [showUpdateButton, setShowUpdateButton] = useState<boolean>(false);
//   const [hasNewData, setHasNewData] = useState<boolean>(false);

//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetching,
//     isFetchingNextPage,
//     refetch,
//     isRefetching,
//   } = useInfiniteQuery({
//     queryKey: ["news"],
//     queryFn: async ({ pageParam = 0 }): Promise<NewsItemType[]> => {
//       const { data, error } = await supabase
//         .from("news")
//         .select("*")
//         .order("is_pinned", { ascending: false }) // Pinned items first
//         .order("pinned_at", { ascending: false }) // Sort pinned items by pinned date (add this column if needed)
//         .order("created_at", { ascending: false }) // Non-pinned items by creation date
//         .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

//       if (error) throw error;
//       return data as NewsItemType[];
//     },
//     initialPageParam: 0,
//     getNextPageParam: (lastPage, allPages): number | undefined => {
//       return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
//     },
//     maxPages: MAX_PAGES, // New option in v5
//     staleTime: 86400, // 24 hours
//     gcTime: Infinity,
//   });

//   useEffect(() => {
//     const channel = supabase
//       .channel("news_changes")
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "news",
//         },
//         () => {
//           setHasNewData(true);
//           setShowUpdateButton(true);
//         }
//       )
//       .subscribe();

//     return () => {
//       channel.unsubscribe();
//     };
//   }, []);

//   const handleRefresh = async (): Promise<void> => {
//     if (hasNewData) {
//       // Only invalidate the first page when new data arrives
//       await queryClient.invalidateQueries({
//         queryKey: ["news"],
//         refetchType: "all",
//       });
//     }
//     setShowUpdateButton(false);
//     setHasNewData(false);
//   };

//   const allNews: NewsItemType[] =
//     data?.pages
//       .flatMap((page) => page)
//       .reduce<NewsItemType[]>((unique, item) => {
//         if (!unique.some((existing) => existing.id === item.id)) {
//           unique.push(item);
//         }
//         return unique;
//       }, []) ?? [];

//   return {
//     allNews,
//     hasNextPage,
//     isFetchingNextPage,
//     fetchNextPage,
//     showUpdateButton,
//     hasNewData,
//     handleRefresh,
//     isRefetching,
//   };
// };


// import { useState, useEffect } from "react";
// import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
// import { supabase } from "@/utils/supabase";

// export type NewsItemType = {
//   id: number;
//   created_at: string;
//   title?: string;
//   body_text?: string;
//   image_url?: string[];
//   external_url?: string[];
//   internal_url?: string[];
//   is_pinned?: boolean;
// };

// const PAGE_SIZE = 5;

// /**
//  * This hook fetches news items from Supabase in an infinite-scrolling pattern.
//  * We also limit the total pages stored to `maxPages`, so we don't hold too many
//  * pages in memory or refetch them all on subsequent calls.
//  */
// export const useFetchNews = () => {
//   const queryClient = useQueryClient();
//   const [showUpdateButton, setShowUpdateButton] = useState(false);
//   const [hasNewData, setHasNewData] = useState(false);

//   /**
//    * `useInfiniteQuery` with `maxPages` set to 4 means we keep at most
//    * 4 pages of data in the React Query cache. Older pages are removed
//    * as new pages are fetched if we exceed 4 total.
//    */
//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetching,
//     isFetchingNextPage,
//     refetch,
//     isRefetching,
//     isError,
//     error,
//   } = useInfiniteQuery<NewsItemType[], Error>({
//     queryKey: ["news"],
//     queryFn: async ({ pageParam = 0 }) => {
//       const { data, error } = await supabase
//         .from("news")
//         .select("*")
//         .order("is_pinned", { ascending: false })
//         .order("created_at", { ascending: false })
//         .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

//       if (error) throw error;
//       return data as NewsItemType[];
//     },
//     // The first page param is 0
//     initialPageParam: 0,
//     /**
//      * Must return the next page param if there's more data to load,
//      * or `undefined` otherwise.
//      */
//     getNextPageParam: (lastPage, allPages) => {
//       // If we got exactly PAGE_SIZE items, assume there's another page
//       return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
//     },
//     /**
//      *  If you need to fetch pages in both directions (bi-directional scrolling),
//      *  also add getPreviousPageParam. For a one-direction feed, it's not needed.
//      */
//     maxPages: 4, // Keep at most 4 pages in the cache
//     staleTime: 86400 * 1000, //! data considered fresh for 24h
//     gcTime: Infinity,     //! do not garbage collect by time
//   });

//   // Listen for changes on the "news" table. If new data arrives,
//   // show an "update" button.
//   useEffect(() => {
//     const channel = supabase
//       .channel("news_changes")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "news" },
//         () => {
//           setHasNewData(true);
//           setShowUpdateButton(true);
//         }
//       )
//       .subscribe();

//     return () => {
//       channel.unsubscribe();
//     };
//   }, []);

//   /**
//    * If new data arrived, we can invalidate the existing query to force
//    * a refetch. By default, this will start from the first page.
//    */
//   const handleRefresh = async () => {
//     if (hasNewData) {
//       await queryClient.invalidateQueries({
//         queryKey: ["news"],
//         refetchType: "all",
//       });
//     }
//     setHasNewData(false);
//     setShowUpdateButton(false);
//   };

//   /**
//    * Flatten all pages into a single array, deduplicating by `id`
//    * in case pinned items or re-fetches cause duplicates.
//    */
//   const allNews: NewsItemType[] =
//     data?.pages
//       .flatMap((page) => page)
//       .reduce<NewsItemType[]>((unique, item) => {
//         if (!unique.some((existing) => existing.id === item.id)) {
//           unique.push(item);
//         }
//         return unique;
//       }, []) ?? [];

//   return {
//     allNews,
//     hasNextPage,
//     isFetching,
//     isFetchingNextPage,
//     isRefetching,
//     isError,
//     error,
//     showUpdateButton,
//     hasNewData,

//     fetchNextPage,
//     handleRefresh,
//   };
// };




import { useState, useEffect } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { useSupabaseRealtime } from "@/components/SupabaseRealtimeProvider";

export type NewsItemType = {
  id: number;
  created_at: string;
  title?: string;
  body_text?: string;
  image_url?: string[];
  external_url?: string[];
  internal_url?: string[];
  is_pinned?: boolean;
};

const PAGE_SIZE = 10; // Increased for mobile to reduce number of fetches

export const useFetchNews = () => {
  const queryClient = useQueryClient();
  const { hasNewNewsData, clearNewNewsFlag } = useSupabaseRealtime();
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update button visibility based on new data flag from context
  useEffect(() => {
    setShowUpdateButton(hasNewNewsData);
  }, [hasNewNewsData]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<NewsItemType[], Error>({
    queryKey: ["news"],
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

      if (error) throw error;
      return data as NewsItemType[];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
    },
    maxPages: 4,
    staleTime: 86400 * 1000, // 24 hours
    gcTime: Infinity,
    // Add these options for better mobile performance
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  /**
   * Handle pull-to-refresh
   */
  const handlePullToRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      clearNewNewsFlag();
      setShowUpdateButton(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  /**
   * Handle refresh when new data is available (via update button)
   */
  const handleRefresh = async () => {
    if (hasNewNewsData) {
      await queryClient.invalidateQueries({
        queryKey: ["news"],
        refetchType: "all",
      });
      clearNewNewsFlag();
    }
    setShowUpdateButton(false);
  };

  /**
   * Handle infinite scroll with debouncing
   */
  const handleLoadMore = async () => {
    if (!isFetchingNextPage && hasNextPage) {
      await fetchNextPage();
    }
  };

  /**
   * Flatten and deduplicate news items
   */
  const allNews: NewsItemType[] = data?.pages
    .flatMap((page) => page)
    .reduce<NewsItemType[]>((unique, item) => {
      if (!unique.some((existing) => existing.id === item.id)) {
        unique.push(item);
      }
      return unique;
    }, []) ?? [];

  return {
    allNews,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isRefetching,
    isError,
    error,
    isLoading,
    showUpdateButton,
    hasNewNewsData,
    isRefreshing,
    fetchNextPage: handleLoadMore,
    handleRefresh,
    handlePullToRefresh,
  };
};