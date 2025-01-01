import { useState, useEffect } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase';

export type NewsItemType = { 
id: number;
created_at: string;
title?: string;
body_text? :string;
image_url?: string[];
external_url?: string[];
internal_url?: string[];
is_pinned?: boolean;

}
const PAGE_SIZE = 5;

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
    refetch
  } = useInfiniteQuery({
    queryKey: ['news'],
    queryFn: async ({ pageParam = 0 }): Promise<NewsItemType[]> => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

        console.log(data?.length)
      if (error) throw error;
      return data as NewsItemType[];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages): number | undefined => {
      return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
    },
    staleTime: 86400,
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
    await queryClient.resetQueries({ queryKey: ['news'] });
    await refetch();
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
    handleRefresh
  };
};