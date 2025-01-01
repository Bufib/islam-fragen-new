import { useState, useEffect } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase';

export type NewsItemType = {
  id: number;
  created_at: string;
  title?: string;
  body_text?: string;
  image_url?: string[];
  external_url?: string[];
  internal_url?: string[];
  is_pinned?: boolean;
}

const PAGE_SIZE = 5;
const MAX_PAGES = 4; // This will store up to 20 news items (4 pages * 5 items)

export const useFetchNews = () => {
  const queryClient = useQueryClient();
  const [showUpdateButton, setShowUpdateButton] = useState<boolean>(false);
  const [hasNewData, setHasNewData] = useState<boolean>(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ['news'],
    queryFn: async ({ pageParam = 0 }): Promise<NewsItemType[]> => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

      if (error) throw error;
      return data as NewsItemType[];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages): number | undefined => {
      return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
    },
    maxPages: MAX_PAGES, // New option in v5
    staleTime: 86400, // 24 hours
    gcTime: Infinity,
  });

  useEffect(() => {
    const channel = supabase
      .channel('news_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'news'
        },
        () => {
          setHasNewData(true);
          setShowUpdateButton(true);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handleRefresh = async (): Promise<void> => {
    if (hasNewData) {
      // Only invalidate the first page when new data arrives
      await queryClient.invalidateQueries({ 
        queryKey: ['news'],
        refetchType: 'all' 
      });
    }
    setShowUpdateButton(false);
    setHasNewData(false);
  };

  const allNews = data?.pages.flatMap(page => page) ?? [];

  return {
    allNews,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    showUpdateButton,
    hasNewData,
    handleRefresh,
    isRefetching,
  };
};