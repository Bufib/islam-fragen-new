import * as SQLite from "expo-sqlite";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import Storage from "expo-sqlite/kv-store";

const SETUP_KEY = "database_initialized";

// Types
export type AllTableNamesType = {
  id: number;
  category: string;
  tableName: string;
  created_at: string;
};

export type QuestionOneAnswerType = {
  id: number;
  category: string;
  question: string;
  answer: string;
  created_at: string;
};

export type QuestionAnswerPerMarjaType = {
  id: number;
  category: string;
  question: string;
  answer_sistani: string;
  answer_khamenei: string;
  created_at: string;
};

// Check if database is initialized in MMKV
const isDatabaseInitialized = async () => {
  const value = await Storage.getItem(SETUP_KEY);
  return value === "true";
};

// Mark database as initialized in MMKV
const markDatabaseInitialized = async () => {
  console.log("Marking database as initialized...");
  await Storage.setItem(SETUP_KEY, "true");
};

// Initialize database tables
const initDatabase = async (db: SQLite.SQLiteDatabase) => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS AllTableNames (
      id INTEGER PRIMARY KEY,
      category TEXT,
      tableName TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS QuestionsOneAnswer (
      id INTEGER PRIMARY KEY,
      tableName TEXT,
      category TEXT,
      question TEXT,
      answer TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS QuestionsMarjaAnswer (
      id INTEGER PRIMARY KEY,
      tableName TEXT,
      category TEXT,
      question TEXT,
      answer_sistani TEXT,
      answer_khamenei TEXT,
      created_at TEXT
    );
  `);
};

// Store table names in SQLite
const storeTableNames = async (
  db: SQLite.SQLiteDatabase,
  data: AllTableNamesType[]
) => {
  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM AllTableNames;");

    for (const item of data) {
      await db.runAsync(
        "INSERT INTO AllTableNames (id, category, tableName, created_at) VALUES (?, ?, ?, ?);",
        [item.id, item.category, item.tableName, item.created_at]
      );
    }
  });
};

// Store Q&A data in SQLite
const storeQAData = async (
  db: SQLite.SQLiteDatabase,
  tableName: string,
  category: string,
  isMarjaTable: boolean,
  data: QuestionOneAnswerType[] | QuestionAnswerPerMarjaType[]
) => {
  await db.withTransactionAsync(async () => {
    if (isMarjaTable) {
      await db.runAsync(
        "DELETE FROM QuestionsMarjaAnswer WHERE tableName = ?;",
        [tableName]
      );

      for (const item of data as QuestionAnswerPerMarjaType[]) {
        await db.runAsync(
          `INSERT OR REPLACE INTO QuestionsMarjaAnswer 
          (id, tableName, category, question, answer_sistani, answer_khamenei, created_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?);`,
          [
            item.id,
            tableName,
            category,
            item.question,
            item.answer_sistani,
            item.answer_khamenei,
            item.created_at,
          ]
        );
      }
    } else {
      await db.runAsync("DELETE FROM QuestionsOneAnswer WHERE tableName = ?;", [
        tableName,
      ]);

      for (const item of data as QuestionOneAnswerType[]) {
        await db.runAsync(
          "INSERT OR REPLACE INTO QuestionsOneAnswer (id, tableName, category, question, answer, created_at) VALUES (?, ?, ?, ?, ?, ?);",
          [
            item.id,
            tableName,
            category,
            item.question,
            item.answer,
            item.created_at,
          ]
        );
      }
    }
  });
};

// Get tables for a specific category
const getTableNamesByCategory = async (
  db: SQLite.SQLiteDatabase,
  category: string
) => {
  const tables = await db.getAllAsync<AllTableNamesType>(
    "SELECT * FROM AllTableNames WHERE category = ? ORDER BY tableName;",
    [category]
  );
  return tables;
};

// Get Q&A data for a specific table
const getQAForTable = async (
  db: SQLite.SQLiteDatabase,
  tableName: string,
  isMarjaTable: boolean
) => {
  if (isMarjaTable) {
    return await db.getAllAsync<QuestionAnswerPerMarjaType>(
      "SELECT * FROM QuestionsMarjaAnswer WHERE tableName = ? ORDER BY created_at;",
      [tableName]
    );
  } else {
    return await db.getAllAsync<QuestionOneAnswerType>(
      "SELECT * FROM QuestionsOneAnswer WHERE tableName = ? ORDER BY created_at;",
      [tableName]
    );
  }
};

// React hook to manage everything
export const useQADatabase = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  const getTablesByCategory = async (category: string) => {
    if (!db) return null;
    try {
      return await getTableNamesByCategory(db, category);
    } catch (err) {
      console.error(`Error getting tables for category ${category}:`, err);
      return null;
    }
  };

  const getQuestionsForTable = async (tableName: string, category: string) => {
    if (!db) return null;
    try {
      const isMarjaTable = category === "Rechtsfragen";
      return await getQAForTable(db, tableName, isMarjaTable);
    } catch (err) {
      console.error(`Error getting Q&As for table ${tableName}:`, err);
      return null;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        const database = await SQLite.openDatabaseAsync("qaDatabase.db");
        setDb(database);

        await initDatabase(database);

        const isDbInitialized = await isDatabaseInitialized();

        if (!isDbInitialized) {
          console.log("First time setup - fetching from Supabase");
          const { data: allTableNames, error: tableError } = await supabase
            .from("AllTableNames")
            .select("*")
            .order("category", { ascending: true });

          if (tableError) throw tableError;

          await storeTableNames(database, allTableNames);

          for (const table of allTableNames) {
            const isMarjaTable = table.category === "Rechtsfragen";
            const { data: qaData, error: qaError } = await supabase
              .from(table.tableName)
              .select("*")
              .order("created_at", { ascending: true });

            if (qaError) throw qaError;
            await storeQAData(
              database,
              table.tableName,
              table.category,
              isMarjaTable,
              qaData
            );
          }

          markDatabaseInitialized();
        } else {
          console.log("Using existing data from SQLite");
        }

        setIsInitialized(true);
        setLoading(false);
      } catch (err) {
        console.error("Error initializing database:", err);
        setError(err as Error);
        setLoading(false);
      }
    };

    initialize();

    return () => {
      if (db) {
        db.closeAsync().catch((err) =>
          console.error("Error closing database:", err)
        );
      }
    };
  }, []);

  useEffect(() => {
    if (!isInitialized || !db) return;

    const allTablesSubscription = supabase
      .channel("all_tables_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "AllTableNames" },
        async () => {
          try {
            const { data: newData, error } = await supabase
              .from("AllTableNames")
              .select("*")
              .order("category", { ascending: true });

            if (error) throw error;
            await storeTableNames(db, newData);
          } catch (err) {
            console.error("Error handling table names update:", err);
          }
        }
      )
      .subscribe();

    const tableSubscriptions: any[] = [];
    const setupTableSubscription = async () => {
      const tables = await getTableNamesByCategory(db, "Rechtsfragen");
      if (tables) {
        for (const table of tables) {
          const subscription = supabase
            .channel(`table_${table.tableName}_changes`)
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: table.tableName },
              async () => {
                try {
                  const { data: newData, error } = await supabase
                    .from(table.tableName)
                    .select("*")
                    .order("created_at", { ascending: true });

                  if (error) throw error;

                  const isMarjaTable = table.category === "Rechtsfragen";
                  await storeQAData(
                    db,
                    table.tableName,
                    table.category,
                    isMarjaTable,
                    newData
                  );
                } catch (err) {
                  console.error(
                    `Error handling ${table.tableName} update:`,
                    err
                  );
                }
              }
            )
            .subscribe();

          tableSubscriptions.push(subscription);
        }
      }
    };

    setupTableSubscription();

    return () => {
      allTablesSubscription.unsubscribe();
      tableSubscriptions.forEach((sub) => sub.unsubscribe());
    };
  }, [isInitialized, db]);

  return {
    loading,
    error,
    getTablesByCategory,
    getQuestionsForTable,
  };
};
