import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

export default function useFetchNews() {
  const [news, setNews] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updated, setUpdated] = useState(false); // Tracks if there's an update

  type NewsType = {
    id: number; 
    created_at: string; 
    title: string; 
    body_text: string; 
    imageLink?: string | null; 
    external_link?: string | null; 
    internal_link?: string | null; 
    is_pinned?: boolean | null; 
  };
  
  // Fetch news from Supabase
  const fetchNewsFromSupabase = async () => {
    try {
      setLoading(true);
      setError("");

      const { data: newsData, error } = await supabase
        .from("news")
        .select("*")
        .limit(5);

      if (error) {
        setError(error.message);
        console.error("Error fetching news from Supabase:", error.message);
        return;
      }

      if (!newsData || newsData.length === 0) {
        console.log("No news found in Supabase.");
        setNews([]);
        return;
      }

      setNews(newsData);
    } catch (err) {
      console.error("Error in fetching news:", err);
      setError("Error in fetching news.");
    } finally {
      setLoading(false);
    }
  };

  // Setup Supabase subscriptions
  const setupSubscriptions = () => {
    const subscription = supabase
      .channel("news")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "news" },
        async (payload) => {
          console.log("Change received!", payload);

          // Notify about updates
          setUpdated(true);

          // Refetch news after an update
          await fetchNewsFromSupabase();

          // Reset the update flag after notifying
          setTimeout(() => setUpdated(false), 3000); // Notify for 3 seconds
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  };

  // Use useEffect for initialization
  useEffect(() => {
    fetchNewsFromSupabase();
    const unsubscribe = setupSubscriptions();

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // Return the state and a refetch function
  return { news, loading, error, updated, refetch: fetchNewsFromSupabase };
}
