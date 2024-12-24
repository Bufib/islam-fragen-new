// import * as SQLite from "expo-sqlite";
// import { supabase } from "@/utils/supabase";
// import { useEffect, useState } from "react";
// import Storage from "expo-sqlite/kv-store";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const SETUP_KEY = "database_initialized";

// // Types
// export type AllTableNamesType = {
//   id: number;
//   category: string;
//   tableName: string;
//   created_at: string;
// };

// export type QuestionOneAnswerType = {
//   id: number;
//   category: string;
//   question: string;
//   title: string;
//   answer: string;
//   created_at: string;
// };

// export type QuestionAnswerPerMarjaType = {
//   id: number;
//   category: string;
//   question: string;
//   title: string;
//   answer_sistani: string;
//   answer_khamenei: string;
//   created_at: string;
// };

// // Check if database is initialized in MMKV
// const isDatabaseInitialized = async () => {
//   const value = await Storage.getItem(SETUP_KEY);
//   return value === "true";
// };

// // Mark database as initialized in MMKV
// const markDatabaseInitialized = async () => {
//   console.log("Marking database as initialized...");
//   await Storage.setItem(SETUP_KEY, "true");
// };

// // Initialize database tables
// const initDatabase = async (db: SQLite.SQLiteDatabase) => {
//   await db.execAsync(`
//     PRAGMA journal_mode = WAL;

//     CREATE TABLE IF NOT EXISTS AllTableNames (
//       id INTEGER PRIMARY KEY,
//       category TEXT,
//       tableName TEXT,
//       created_at TEXT
//     );

//     CREATE TABLE IF NOT EXISTS QuestionsOneAnswer (
//       id INTEGER PRIMARY KEY,
//       tableName TEXT,
//       category TEXT,
//       question TEXT,
//       title TEXT,
//       answer TEXT,
//       created_at TEXT
//     );

//     CREATE TABLE IF NOT EXISTS QuestionsMarjaAnswer (
//       id INTEGER PRIMARY KEY,
//       tableName TEXT,
//       category TEXT,
//       question TEXT,
//        title TEXT,
//       answer_sistani TEXT,
//       answer_khamenei TEXT,
//       created_at TEXT
//     );
//   `);
// };

// // Store table names in SQLite
// const storeTableNames = async (
//   db: SQLite.SQLiteDatabase,
//   data: AllTableNamesType[]
// ) => {
//   await db.withTransactionAsync(async () => {
//     await db.runAsync("DELETE FROM AllTableNames;");

//     for (const item of data) {
//       await db.runAsync(
//         "INSERT INTO AllTableNames (id, category, tableName, created_at) VALUES (?, ?, ?, ?);",
//         [item.id, item.category, item.tableName, item.created_at]
//       );
//     }
//   });
// };

// // Store Q&A data in SQLite
// const storeQAData = async (
//   db: SQLite.SQLiteDatabase,
//   tableName: string,
//   category: string,
//   isMarjaTable: boolean,
//   data: QuestionOneAnswerType[] | QuestionAnswerPerMarjaType[]
// ) => {
//   await db.withTransactionAsync(async () => {
//     if (isMarjaTable) {
//       await db.runAsync(
//         "DELETE FROM QuestionsMarjaAnswer WHERE tableName = ?;",
//         [tableName]
//       );

//       for (const item of data as QuestionAnswerPerMarjaType[]) {
//         await db.runAsync(
//           `INSERT OR REPLACE INTO QuestionsMarjaAnswer
//           (id, tableName, category, question, title, answer_sistani, answer_khamenei, created_at)
//           VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
//           [
//             item.id,
//             tableName,
//             category,
//             item.question,
//             item.answer_sistani,
//             item.answer_khamenei,
//             item.created_at,
//           ]
//         );
//       }
//     } else {
//       await db.runAsync("DELETE FROM QuestionsOneAnswer WHERE tableName = ?;", [
//         tableName,
//       ]);

//       for (const item of data as QuestionOneAnswerType[]) {
//         await db.runAsync(
//           "INSERT OR REPLACE INTO QuestionsOneAnswer (id, tableName, category, question, title, answer, created_at) VALUES (?, ?, ?, ?, ?, ?, ?);",
//           [
//             item.id,
//             tableName,
//             category,
//             item.question,
//             item.answer,
//             item.created_at,
//           ]
//         );
//       }
//     }
//   });
// };

// // Get tables for a specific category
// const getTableNamesByCategory = async (
//   db: SQLite.SQLiteDatabase,
//   category: string
// ) => {
//   const tables = await db.getAllAsync<AllTableNamesType>(
//     "SELECT * FROM AllTableNames WHERE category = ? ORDER BY tableName;",
//     [category]
//   );
//   return tables;
// };

// // Get Q&A data for a specific table
// const getQAForTable = async (
//   db: SQLite.SQLiteDatabase,
//   tableName: string,
//   isMarjaTable: boolean
// ) => {
//   if (isMarjaTable) {
//     return await db.getAllAsync<QuestionAnswerPerMarjaType>(
//       "SELECT * FROM QuestionsMarjaAnswer WHERE tableName = ? ORDER BY created_at;",
//       [tableName]
//     );
//   } else {
//     return await db.getAllAsync<QuestionOneAnswerType>(
//       "SELECT * FROM QuestionsOneAnswer WHERE tableName = ? ORDER BY created_at;",
//       [tableName]
//     );
//   }
// };

// import * as SQLite from "expo-sqlite";
// import { supabase } from "@/utils/supabase";
// import { useEffect, useState } from "react";
// import Storage from "expo-sqlite/kv-store";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const SETUP_KEY = "database_initialized";

// // Types
// export type AllTableNamesType = {
//   id: number;
//   category: string;
//   tableName: string;
//   created_at: string;
// };

// export type QuestionOneAnswerType = {
//   id: number;
//   category: string;
//   question: string;
//   title: string;
//   answer: string;
//   created_at: string;
// };

// export type QuestionAnswerPerMarjaType = {
//   id: number;
//   category: string;
//   question: string;
//   title: string;
//   answer_sistani: string;
//   answer_khamenei: string;
//   created_at: string;
// };

// // Check if database is initialized in MMKV
// const isDatabaseInitialized = async () => {
//   const value = await Storage.getItem(SETUP_KEY);
//   return value === "true";
// };

// // Mark database as initialized in MMKV
// const markDatabaseInitialized = async () => {
//   console.log("Marking database as initialized...");
//   await Storage.setItem(SETUP_KEY, "true");
// };

// // Initialize database tables
// const initDatabase = async (db: SQLite.SQLiteDatabase) => {
//   await db.execAsync(`
//     PRAGMA journal_mode = WAL;

//     CREATE TABLE IF NOT EXISTS AllTableNames (
//       id INTEGER PRIMARY KEY,
//       category TEXT,
//       tableName TEXT,
//       created_at TEXT
//     );

//     CREATE TABLE IF NOT EXISTS QuestionsOneAnswer (
//       id INTEGER PRIMARY KEY,
//       tableName TEXT,
//       category TEXT,
//       question TEXT,
//       answer TEXT,
//       created_at TEXT
//     );

//     CREATE TABLE IF NOT EXISTS QuestionsMarjaAnswer (
//       id INTEGER PRIMARY KEY,
//       tableName TEXT,
//       category TEXT,
//       question TEXT,
//       answer_sistani TEXT,
//       answer_khamenei TEXT,
//       created_at TEXT
//     );
//   `);
// };

// // Store table names in SQLite
// const storeTableNames = async (
//   db: SQLite.SQLiteDatabase,
//   data: AllTableNamesType[]
// ) => {
//   await db.withTransactionAsync(async () => {
//     await db.runAsync("DELETE FROM AllTableNames;");

//     for (const item of data) {
//       await db.runAsync(
//         "INSERT INTO AllTableNames (id, category, tableName, created_at) VALUES (?, ?, ?, ?);",
//         [item.id, item.category, item.tableName, item.created_at]
//       );
//     }
//   });
// };

// // Store Q&A data in SQLite
// const storeQAData = async (
//   db: SQLite.SQLiteDatabase,
//   tableName: string,
//   category: string,
//   isMarjaTable: boolean,
//   data: QuestionOneAnswerType[] | QuestionAnswerPerMarjaType[]
// ) => {
//   await db.withTransactionAsync(async () => {
//     if (isMarjaTable) {
//       await db.runAsync(
//         "DELETE FROM QuestionsMarjaAnswer WHERE tableName = ?;",
//         [tableName]
//       );

//       for (const item of data as QuestionAnswerPerMarjaType[]) {
//         await db.runAsync(
//           `INSERT OR REPLACE INTO QuestionsMarjaAnswer
//           (id, tableName, category, question, answer_sistani, answer_khamenei, created_at)
//           VALUES (?, ?, ?, ?, ?, ?, ?);`,
//           [
//             item.id,
//             tableName,
//             category,
//             item.question,
//             item.answer_sistani,
//             item.answer_khamenei,
//             item.created_at,
//           ]
//         );
//       }
//     } else {
//       await db.runAsync("DELETE FROM QuestionsOneAnswer WHERE tableName = ?;", [
//         tableName,
//       ]);

//       for (const item of data as QuestionOneAnswerType[]) {
//         await db.runAsync(
//           "INSERT OR REPLACE INTO QuestionsOneAnswer (id, tableName, category, question, answer, created_at) VALUES (?, ?, ?, ?, ?, ?);",
//           [
//             item.id,
//             tableName,
//             category,
//             item.question,
//             item.answer,
//             item.created_at,
//           ]
//         );
//       }
//     }
//   });
// };

// // Get tables for a specific category
// const getTableNamesByCategory = async (
//   db: SQLite.SQLiteDatabase,
//   category: string
// ) => {
//   const tables = await db.getAllAsync<AllTableNamesType>(
//     "SELECT * FROM AllTableNames WHERE category = ? ORDER BY tableName;",
//     [category]
//   );
//   return tables;
// };

// // Get Q&A data for a specific table
// const getQAForTable = async (
//   db: SQLite.SQLiteDatabase,
//   tableName: string,
//   isMarjaTable: boolean
// ) => {
//   if (isMarjaTable) {
//     return await db.getAllAsync<QuestionAnswerPerMarjaType>(
//       "SELECT * FROM QuestionsMarjaAnswer WHERE tableName = ? ORDER BY created_at;",
//       [tableName]
//     );
//   } else {
//     return await db.getAllAsync<QuestionOneAnswerType>(
//       "SELECT * FROM QuestionsOneAnswer WHERE tableName = ? ORDER BY created_at;",
//       [tableName]
//     );
//   }
// };

import * as SQLite from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/utils/supabase"; // or wherever your Supabase client is
import { useEffect, useState } from "react";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";

const DB_VERSION_KEY = "db_version";
export const DATABASE_NAME = "qaDatabase.db";

// ---------------------------------------
//  Types
// ---------------------------------------
export type AllTableNamesType = {
  id: number;
  category: string;
  tableName: string;
  created_at: string;
};

export type QuestionOneAnswerType = {
  id: number;
  category: string;
  tableName: string;
  question: string;
  title: string;
  answer: string;
  created_at: string;
};

export type QuestionAnswerPerMarjaType = {
  id: number;
  category: string;
  tableName: string;
  question: string;
  title: string;
  answer_sistani: string;
  answer_khamenei: string;
  created_at: string;
};

// ---------------------------------------
//  Database initialization function
// ---------------------------------------
export async function migrateDbIfNeeded(db: SQLite.SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  const { user_version: currentVersion } = await db.getFirstAsync<{
    user_version: number | null;
  }>("PRAGMA user_version");

  if (currentVersion < DATABASE_VERSION) {
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
        title TEXT,
        answer TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS QuestionsMarjaAnswer (
        id INTEGER PRIMARY KEY,
        tableName TEXT,
        category TEXT,
        question TEXT,
        title TEXT,
        answer_sistani TEXT,
        answer_khamenei TEXT,
        created_at TEXT
      );

      PRAGMA user_version = ${DATABASE_VERSION};
    `);
  }
}

// ---------------------------------------
//  Utility: Store AllTableNames in local DB
// ---------------------------------------
async function storeTableNames(
  db: SQLite.SQLiteDatabase,
  data: AllTableNamesType[]
) {
  // We use a prepared statement
  const statement = await db.prepareAsync(
    "INSERT INTO AllTableNames (id, category, tableName, created_at) VALUES (?, ?, ?, ?)"
  );

  try {
    // Clear old data first
    await db.runAsync("DELETE FROM AllTableNames;");
    // Insert fresh data
    for (const item of data) {
      await statement.executeAsync([
        item.id,
        item.category,
        item.tableName,
        item.created_at,
      ]);
    }
  } finally {
    // finalize statement to avoid memory leaks
    await statement.finalizeAsync();
  }
}

// ---------------------------------------
//  Utility: Store Q/A data (single or marja answers)
// ---------------------------------------
async function storeQAData(
  db: SQLite.SQLiteDatabase,
  tableName: string,
  category: string,
  isMarjaTable: boolean,
  data: QuestionOneAnswerType[] | QuestionAnswerPerMarjaType[]
) {
  await db.withExclusiveTransactionAsync(async () => {
    if (isMarjaTable) {
      // If it’s a “Rechtsfragen” or other multi-answer table
      await db.runAsync(
        "DELETE FROM QuestionsMarjaAnswer WHERE tableName = ?;",
        [tableName]
      );
      const statement = await db.prepareAsync(`
        INSERT OR REPLACE INTO QuestionsMarjaAnswer
        (id, tableName, category, question, title, answer_sistani, answer_khamenei, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `);
      try {
        for (const item of data as QuestionAnswerPerMarjaType[]) {
          await statement.executeAsync([
            item.id,
            tableName,
            category,
            item.question,
            item.answer_sistani,
            item.answer_khamenei,
            item.created_at,
          ]);
        }
      } finally {
        await statement.finalizeAsync();
      }
    } else {
      // Single-answer tables
      await db.runAsync("DELETE FROM QuestionsOneAnswer WHERE tableName = ?;", [
        tableName,
      ]);
      const statement = await db.prepareAsync(`
        INSERT OR REPLACE INTO QuestionsOneAnswer
        (id, tableName, category, question, title, answer, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `);
      try {
        for (const item of data as QuestionOneAnswerType[]) {
          await statement.executeAsync([
            item.id,
            tableName,
            category,
            item.question,
            item.answer,
            item.created_at,
          ]);
        }
      } finally {
        await statement.finalizeAsync();
      }
    }
  });
}

// ---------------------------------------
//  React Hook to manage DB usage
// ---------------------------------------
export function useQADatabase() {
  // This gives us the db instance from SQLiteProvider
  const db = useSQLiteContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // ---------- GETTER: Tables by Category ----------
  const getTablesByCategory = async (category: string) => {
    try {
      return await db.getAllAsync<AllTableNamesType>(
        "SELECT * FROM AllTableNames WHERE category = ? ORDER BY tableName;",
        [category]
      );
    } catch (err) {
      console.error("Error getting tables by category:", err);
      throw err;
    }
  };

  // ---------- GETTER: Questions for Table ----------
  const getQuestionsForTable = async (tableName: string, category: string) => {
    const isMarjaTable = category === "Rechtsfragen";
    try {
      return await db.getAllAsync<
        QuestionOneAnswerType | QuestionAnswerPerMarjaType
      >(
        `SELECT * FROM ${
          isMarjaTable ? "QuestionsMarjaAnswer" : "QuestionsOneAnswer"
        } WHERE tableName = ? ORDER BY created_at;`,
        [tableName]
      );
    } catch (err) {
      console.error("Error getting questions for table:", err);
      throw err;
    }
  };

  // ---------------------------------------
  //   Initialize or Update Local Database
  // ---------------------------------------
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        setLoading(true);

        // 1) Always fetch the "version" from Supabase (VersionTable)
        const { data: versionRow, error: versionError } = await supabase
          .from("Version")
          .select("version")
          .single();

        if (versionError) throw versionError;
        const remoteVersion = versionRow?.version;
        const localVersion = await AsyncStorage.getItem(DB_VERSION_KEY);

        // 2) Compare remote vs. local
        if (!localVersion || localVersion !== remoteVersion) {
          console.log("Version changed or missing. Re-fetching all data...");

          // Re-fetch AllTableNames
          const { data: allTableNames, error: tableError } = await supabase
            .from("AllTableNames")
            .select("*")
            .order("category", { ascending: true });
          if (tableError) throw tableError;

          await storeTableNames(db, allTableNames);

          // Re-fetch each Q&A table
          for (const table of allTableNames) {
            const isMarja = table.category === "Rechtsfragen";
            const { data: qaData, error: qaError } = await supabase
              .from(table.tableName)
              .select("*")
              .order("created_at", { ascending: true });
            if (qaError) throw qaError;

            await storeQAData(
              db,
              table.tableName,
              table.category,
              isMarja,
              qaData
            );
          }

          // 3) Store new version locally
          await AsyncStorage.setItem(DB_VERSION_KEY, remoteVersion);
        } else {
          console.log("Version is unchanged. Using local SQLite only.");
        }
      } catch (err) {
        console.error("Error initializing database:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    initializeDatabase();
  }, [db]);

  // ---------------------------------------
  //   SUBSCRIPTIONS: Listen for changes
  // ---------------------------------------

  // 1) Subscribe to AllTableNames changes
  useEffect(() => {
    const channel = supabase
      .channel("public:AllTableNames-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "AllTableNames" },
        async (payload) => {
          console.log("AllTableNames change:", payload);
          try {
            const { data: updatedAllTableNames, error: tableError } =
              await supabase
                .from("AllTableNames")
                .select("*")
                .order("category", { ascending: true });

            if (tableError) throw tableError;
            await storeTableNames(db, updatedAllTableNames);
          } catch (err) {
            console.error(
              "Error updating AllTableNames from subscription:",
              err
            );
            setError(err as Error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [db]);

  // 2) Subscribe to VersionTable changes
  useEffect(() => {
    const versionChannel = supabase
      .channel("public:VersionTable-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "VersionTable" },
        async (payload) => {
          console.log("VersionTable change:", payload);
          try {
            // Re-check the version
            const { data: versionRow, error: versionError } = await supabase
              .from("VersionTable")
              .select("version")
              .single();
            if (versionError) throw versionError;

            const remoteVersion = versionRow?.version;
            const localVersion = await AsyncStorage.getItem(DB_VERSION_KEY);

            // If changed, re-fetch everything
            if (!localVersion || localVersion !== remoteVersion) {
              console.log(
                "Version changed (subscription). Re-fetching all data..."
              );

              const { data: allTableNames, error: tableError } = await supabase
                .from("AllTableNames")
                .select("*")
                .order("category", { ascending: true });
              if (tableError) throw tableError;

              await storeTableNames(db, allTableNames);

              for (const table of allTableNames) {
                const isMarja = table.category === "Rechtsfragen";
                const { data: qaData, error: qaError } = await supabase
                  .from(table.tableName)
                  .select("*")
                  .order("created_at", { ascending: true });

                if (qaError) throw qaError;
                await storeQAData(
                  db,
                  table.tableName,
                  table.category,
                  isMarja,
                  qaData
                );
              }

              await AsyncStorage.setItem(DB_VERSION_KEY, remoteVersion);
            } else {
              console.log(
                "Version subscription triggered, but no change in version."
              );
            }
          } catch (err) {
            console.error("Error from VersionTable subscription:", err);
            setError(err as Error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(versionChannel);
    };
  }, [db]);

  // 3) Subscribe to all Q&A tables (based on local AllTableNames)
  const [tableChannels, setTableChannels] = useState<any[]>([]);

  useEffect(() => {
    let subscribedChannels: any[] = [];

    (async () => {
      try {
        // Get all table names from local DB
        const allTables = await db.getAllAsync<AllTableNamesType>(
          "SELECT * FROM AllTableNames;"
        );

        for (const table of allTables) {
          const ch = supabase
            .channel(`public:${table.tableName}-changes`)
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: table.tableName },
              async (payload) => {
                console.log(`Change in table ${table.tableName}:`, payload);
                try {
                  const isMarja = table.category === "Rechtsfragen";
                  const { data: qaData, error: qaError } = await supabase
                    .from(table.tableName)
                    .select("*")
                    .order("created_at", { ascending: true });

                  if (qaError) throw qaError;
                  await storeQAData(
                    db,
                    table.tableName,
                    table.category,
                    isMarja,
                    qaData
                  );
                } catch (err) {
                  console.error(
                    `Error updating table "${table.tableName}":`,
                    err
                  );
                  setError(err as Error);
                }
              }
            )
            .subscribe();

          subscribedChannels.push(ch);
        }
      } catch (err) {
        console.error("Error subscribing to Q&A tables:", err);
        setError(err as Error);
      }

      setTableChannels(subscribedChannels);
    })();

    return () => {
      // Remove all table-specific channels
      for (const c of subscribedChannels) {
        supabase.removeChannel(c);
      }
    };
  }, [db]);

  return {
    loading,
    error,
    getTablesByCategory,
    getQuestionsForTable,
  };
}
