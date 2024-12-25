// useQandA.ts
import { useEffect, useState, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import {
  initializeDatabase,
  getTablesByCategory as getTablesFunc,
  getQuestionsForTable as getQuestionsFunc,
  cleanupSubscriptions,
  type AllTableNamesType,
  type QuestionOneAnswerType,
  type QuestionAnswerPerMarjaType,
} from "@/hooks/useDatabase";

export function useQADatabase() {
  const db = useSQLiteContext();
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize database
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!mounted || initialized) return;
      
      try {
        setIsInitializing(true);
        await initializeDatabase(db);
        
        if (mounted) {
          setInitialized(true);
          console.log('Database hook initialization complete');
        }
      } catch (err) {
        console.error('Database hook initialization failed:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to initialize database'));
        }
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
      cleanupSubscriptions();
    };
  }, [db]);

  const getTablesByCategory = useCallback(async (category: string) => {
    try {
      if (!initialized) {
        console.log('Database not initialized, initializing...');
        await initializeDatabase(db);
        setInitialized(true);
      }
      return await getTablesFunc(db, category);
    } catch (error) {
      console.error('Error getting tables:', error);
      return [];
    }
  }, [db, initialized]);

  const getQuestionsForTable = useCallback(async (tableName: string, category: string) => {
    try {
      if (!initialized) {
        console.log('Database not initialized, initializing...');
        await initializeDatabase(db);
        setInitialized(true);
      }
      return await getQuestionsFunc(db, tableName, category);
    } catch (error) {
      console.error('Error getting questions:', error);
      return [];
    }
  }, [db, initialized]);

  return {
    loading: isInitializing,
    error,
    getTablesByCategory,
    getQuestionsForTable,
  };
}

export type {
  AllTableNamesType,
  QuestionOneAnswerType,
  QuestionAnswerPerMarjaType,
} from "@/hooks/useDatabase";