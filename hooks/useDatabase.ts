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




// import * as SQLite from "expo-sqlite";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { supabase } from "@/utils/supabase"; // or wherever your Supabase client is
// import { useEffect, useState } from "react";
// import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";

// const DB_VERSION_KEY = "db_version";
// export const DATABASE_NAME = "qaDatabase.db";

// // ---------------------------------------
// //  Types
// // ---------------------------------------
// export type AllTableNamesType = {
//   id: number;
//   category: string;
//   tableName: string;
//   created_at: string;
// };

// export type QuestionOneAnswerType = {
//   id: number;
//   category: string;
//   tableName: string;
//   question: string;
//   title: string;
//   answer: string;
//   created_at: string;
// };

// export type QuestionAnswerPerMarjaType = {
//   id: number;
//   category: string;
//   tableName: string;
//   question: string;
//   title: string;
//   answer_sistani: string;
//   answer_khamenei: string;
//   created_at: string;
// };

// // ---------------------------------------
// //  Database initialization function
// // ---------------------------------------
// export async function migrateDbIfNeeded(db: SQLite.SQLiteDatabase) {
//   const DATABASE_VERSION = 1;
//   const { user_version: currentVersion } = await db.getFirstAsync<{
//     user_version: number | null;
//   }>("PRAGMA user_version");

//   if (currentVersion < DATABASE_VERSION) {
//     await db.execAsync(`
//       PRAGMA journal_mode = WAL;

//       CREATE TABLE IF NOT EXISTS AllTableNames (
//         id INTEGER PRIMARY KEY,
//         category TEXT,
//         tableName TEXT,
//         created_at TEXT
//       );

//       CREATE TABLE IF NOT EXISTS QuestionsOneAnswer (
//         id INTEGER PRIMARY KEY,
//         tableName TEXT,
//         category TEXT,
//         question TEXT,
//         title TEXT,
//         answer TEXT,
//         created_at TEXT
//       );

//       CREATE TABLE IF NOT EXISTS QuestionsMarjaAnswer (
//         id INTEGER PRIMARY KEY,
//         tableName TEXT,
//         category TEXT,
//         question TEXT,
//         title TEXT,
//         answer_sistani TEXT,
//         answer_khamenei TEXT,
//         created_at TEXT
//       );

//       PRAGMA user_version = ${DATABASE_VERSION};
//     `);
//   }
// }

// // ---------------------------------------
// //  Utility: Store AllTableNames in local DB
// // ---------------------------------------
// async function storeTableNames(
//   db: SQLite.SQLiteDatabase,
//   data: AllTableNamesType[]
// ) {
//   // We use a prepared statement
//   const statement = await db.prepareAsync(
//     "INSERT INTO AllTableNames (id, category, tableName, created_at) VALUES (?, ?, ?, ?)"
//   );

//   try {
//     // Clear old data first
//     await db.runAsync("DELETE FROM AllTableNames;");
//     // Insert fresh data
//     for (const item of data) {
//       await statement.executeAsync([
//         item.id,
//         item.category,
//         item.tableName,
//         item.created_at,
//       ]);
//     }
//   } finally {
//     // finalize statement to avoid memory leaks
//     await statement.finalizeAsync();
//   }
// }

// // ---------------------------------------
// //  Utility: Store Q/A data (single or marja answers)
// // ---------------------------------------
// async function storeQAData(
//   db: SQLite.SQLiteDatabase,
//   tableName: string,
//   category: string,
//   isMarjaTable: boolean,
//   data: QuestionOneAnswerType[] | QuestionAnswerPerMarjaType[]
// ) {
//   await db.withExclusiveTransactionAsync(async () => {
//     if (isMarjaTable) {
//       // If it’s a “Rechtsfragen” or other multi-answer table
//       await db.runAsync(
//         "DELETE FROM QuestionsMarjaAnswer WHERE tableName = ?;",
//         [tableName]
//       );
//       const statement = await db.prepareAsync(`
//         INSERT OR REPLACE INTO QuestionsMarjaAnswer
//         (id, tableName, category, question, title, answer_sistani, answer_khamenei, created_at)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?);
//       `);
//       try {
//         for (const item of data as QuestionAnswerPerMarjaType[]) {
//           await statement.executeAsync([
//             item.id,
//             tableName,
//             category,
//             item.question,
//             item.answer_sistani,
//             item.answer_khamenei,
//             item.created_at,
//           ]);
//         }
//       } finally {
//         await statement.finalizeAsync();
//       }
//     } else {
//       // Single-answer tables
//       await db.runAsync("DELETE FROM QuestionsOneAnswer WHERE tableName = ?;", [
//         tableName,
//       ]);
//       const statement = await db.prepareAsync(`
//         INSERT OR REPLACE INTO QuestionsOneAnswer
//         (id, tableName, category, question, title, answer, created_at)
//         VALUES (?, ?, ?, ?, ?, ?, ?);
//       `);
//       try {
//         for (const item of data as QuestionOneAnswerType[]) {
//           await statement.executeAsync([
//             item.id,
//             tableName,
//             category,
//             item.question,
//             item.answer,
//             item.created_at,
//           ]);
//         }
//       } finally {
//         await statement.finalizeAsync();
//       }
//     }
//   });
// }

// // ---------------------------------------
// //  React Hook to manage DB usage
// // ---------------------------------------
// export function useQADatabase() {
//   // This gives us the db instance from SQLiteProvider
//   const db = useSQLiteContext();

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);

//   // ---------- GETTER: Tables by Category ----------
//   const getTablesByCategory = async (category: string) => {
//     try {
//       return await db.getAllAsync<AllTableNamesType>(
//         "SELECT * FROM AllTableNames WHERE category = ? ORDER BY tableName;",
//         [category]
//       );
//     } catch (err) {
//       console.error("Error getting tables by category:", err);
//       throw err;
//     }
//   };

//   // ---------- GETTER: Questions for Table ----------
//   const getQuestionsForTable = async (tableName: string, category: string) => {
//     const isMarjaTable = category === "Rechtsfragen";
//     try {
//       // Log the parameters
//       console.log('Query params:', { tableName, category, isMarjaTable });

//       // Get all data first to check what's actually in the table
//       const allData = await db.getAllAsync(
//         `SELECT * FROM ${isMarjaTable ? "QuestionsMarjaAnswer" : "QuestionsOneAnswer"}`
//       );
//       console.log('All data in table:', allData);

//       // Now do our filtered query
//       const query = `SELECT * FROM ${
//         isMarjaTable ? "QuestionsMarjaAnswer" : "QuestionsOneAnswer"
//       } WHERE tableName = ?`;

//       console.log('Running query:', query, 'with tableName:', tableName);

//       const results = await db.getAllAsync<QuestionOneAnswerType | QuestionAnswerPerMarjaType>(
//         query,
//         [tableName]
//       );

//       console.log('Query results:', results);
//       return results;
//     } catch (err) {
//       console.error("Error getting questions for table:", err);
//       throw err;
//     }
//   };
//   // ---------------------------------------
//   //   Initialize or Update Local Database
//   // ---------------------------------------
//   useEffect(() => {
//     const initializeDatabase = async () => {
//       try {
//         setLoading(true);

//         // 1) Always fetch the "version" from Supabase (VersionTable)
//         const { data: versionRow, error: versionError } = await supabase
//           .from("Version")
//           .select("version")
//           .single();

//         if (versionError) throw versionError;
//         const remoteVersion = versionRow?.version;
//         const localVersion = await AsyncStorage.getItem(DB_VERSION_KEY);

//         // 2) Compare remote vs. local
//         if (!localVersion || localVersion !== remoteVersion) {
//           console.log("Version changed or missing. Re-fetching all data...");

//           // Re-fetch AllTableNames
//           const { data: allTableNames, error: tableError } = await supabase
//             .from("AllTableNames")
//             .select("*")
//             .order("category", { ascending: true });
//           if (tableError) throw tableError;

//           await storeTableNames(db, allTableNames);

//           // Re-fetch each Q&A table
//           for (const table of allTableNames) {
//             const isMarja = table.category === "Rechtsfragen";
//             const { data: qaData, error: qaError } = await supabase
//               .from(table.tableName)
//               .select("*")
//               .order("created_at", { ascending: true });
//             if (qaError) throw qaError;

//             await storeQAData(
//               db,
//               table.tableName,
//               table.category,
//               isMarja,
//               qaData
//             );
//           }

//           // 3) Store new version locally
//           await AsyncStorage.setItem(DB_VERSION_KEY, remoteVersion);
//         } else {
//           console.log("Version is unchanged. Using local SQLite only.");
//         }
//       } catch (err) {
//         console.error("Error initializing database:", err);
//         setError(err as Error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeDatabase();
//   }, [db]);

//   // ---------------------------------------
//   //   SUBSCRIPTIONS: Listen for changes
//   // ---------------------------------------

//   // 1) Subscribe to AllTableNames changes
//   useEffect(() => {
//     const channel = supabase
//       .channel("public:AllTableNames-changes")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "AllTableNames" },
//         async (payload) => {
//           console.log("AllTableNames change:", payload);
//           try {
//             const { data: updatedAllTableNames, error: tableError } =
//               await supabase
//                 .from("AllTableNames")
//                 .select("*")
//                 .order("category", { ascending: true });

//             if (tableError) throw tableError;
//             await storeTableNames(db, updatedAllTableNames);
//           } catch (err) {
//             console.error(
//               "Error updating AllTableNames from subscription:",
//               err
//             );
//             setError(err as Error);
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [db]);

//   // 2) Subscribe to VersionTable changes
//   useEffect(() => {
//     const versionChannel = supabase
//       .channel("public:VersionTable-changes")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "VersionTable" },
//         async (payload) => {
//           console.log("VersionTable change:", payload);
//           try {
//             // Re-check the version
//             const { data: versionRow, error: versionError } = await supabase
//               .from("VersionTable")
//               .select("version")
//               .single();
//             if (versionError) throw versionError;

//             const remoteVersion = versionRow?.version;
//             const localVersion = await AsyncStorage.getItem(DB_VERSION_KEY);

//             // If changed, re-fetch everything
//             if (!localVersion || localVersion !== remoteVersion) {
//               console.log(
//                 "Version changed (subscription). Re-fetching all data..."
//               );

//               const { data: allTableNames, error: tableError } = await supabase
//                 .from("AllTableNames")
//                 .select("*")
//                 .order("category", { ascending: true });
//               if (tableError) throw tableError;

//               await storeTableNames(db, allTableNames);

//               for (const table of allTableNames) {
//                 const isMarja = table.category === "Rechtsfragen";
//                 const { data: qaData, error: qaError } = await supabase
//                   .from(table.tableName)
//                   .select("*")
//                   .order("created_at", { ascending: true });

//                 if (qaError) throw qaError;
//                 await storeQAData(
//                   db,
//                   table.tableName,
//                   table.category,
//                   isMarja,
//                   qaData
//                 );
//               }

//               await AsyncStorage.setItem(DB_VERSION_KEY, remoteVersion);
//             } else {
//               console.log(
//                 "Version subscription triggered, but no change in version."
//               );
//             }
//           } catch (err) {
//             console.error("Error from VersionTable subscription:", err);
//             setError(err as Error);
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(versionChannel);
//     };
//   }, [db]);

//   // 3) Subscribe to all Q&A tables (based on local AllTableNames)
//   const [tableChannels, setTableChannels] = useState<any[]>([]);

//   useEffect(() => {
//     let subscribedChannels: any[] = [];

//     (async () => {
//       try {
//         // Get all table names from local DB
//         const allTables = await db.getAllAsync<AllTableNamesType>(
//           "SELECT * FROM AllTableNames;"
//         );

//         for (const table of allTables) {
//           const ch = supabase
//             .channel(`public:${table.tableName}-changes`)
//             .on(
//               "postgres_changes",
//               { event: "*", schema: "public", table: table.tableName },
//               async (payload) => {
//                 console.log(`Change in table ${table.tableName}:`, payload);
//                 try {
//                   const isMarja = table.category === "Rechtsfragen";
//                   const { data: qaData, error: qaError } = await supabase
//                     .from(table.tableName)
//                     .select("*")
//                     .order("created_at", { ascending: true });

//                   if (qaError) throw qaError;
//                   await storeQAData(
//                     db,
//                     table.tableName,
//                     table.category,
//                     isMarja,
//                     qaData
//                   );
//                 } catch (err) {
//                   console.error(
//                     `Error updating table "${table.tableName}":`,
//                     err
//                   );
//                   setError(err as Error);
//                 }
//               }
//             )
//             .subscribe();

//           subscribedChannels.push(ch);
//         }
//       } catch (err) {
//         console.error("Error subscribing to Q&A tables:", err);
//         setError(err as Error);
//       }

//       setTableChannels(subscribedChannels);
//     })();

//     return () => {
//       // Remove all table-specific channels
//       for (const c of subscribedChannels) {
//         supabase.removeChannel(c);
//       }
//     };
//   }, [db]);

//   return {
//     loading,
//     error,
//     getTablesByCategory,
//     getQuestionsForTable,
//   };
// }

// Get the version from asysncstora
// If non fetch all
// If yes compare with supabase
// If different fetch all
// If same do nothing
// Store the version in async storage
// Store all table names and tables in sql

// import * as SQLite from "expo-sqlite";
// import { supabase } from "@/utils/supabase";
// import { useEffect, useState } from "react";
// import Storage from "expo-sqlite/kv-store";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// type AllTableNamesTyp = {
//   id: number;
//   category: string;
//   tableName: string;
// };

// export const manageData = () => {
//   useEffect(() => {
//     const compareVersions = async () => {
//       try {
//         // Fetch from Supabase
//         const { data, error } = await supabase
//           .from("Version")
//           .select("version")
//           .single();

//         if (error) throw error;
//         if (data?.version) {
//           const versionInLocalDatabase = Storage.getItem("version");
//           if (versionInLocalDatabase === null) {
//             // Fetch everything and save in sql
//             await Storage.setItem("version", data.version);
//           } else {
//             if (versionInLocalDatabase !== data.version) {
//               // refetch everything
//               await Storage.setItem("version", data.version);
//             } else {
//               // versionInLocalDatabase === version in supabse -> load from sql
//             }
//           }
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     compareVersions();
//   }, []);
// };

// export const fetchAllTableNames = async () => {
//   try {
//     const { data, error } = await supabase.from("AllTableNames ").select("*");

//     if (error) throw error;
//     if (data) {
//       console.log(data);
//       // const unique = [...new Set(data.map((item)=>item.tableName))]
//       // console.log(unique)
//       // Store in expo SQL database
//     }
//   } catch (error) {
//     console.log(console.error);
//   }
// };

// const storeAllTableNamesInSql = async (data: AllTableNamesTyp) => {
//   const db = await SQLite.openDatabaseAsync("islamFragenDatabase");

//   await db.execAsync(`
//     PRAGMA journal_mode = WAL;
//     CREATE TABLE IF NOT EXISTS AllTableNames (id INTEGER PRIMARY KEY NOT NULL, category TEXT NOT NULL, tableName TEXT NOT NULL);
//     `);

//   const insertStatement = await db.prepareAsync(
//     "INSERT INTO AllTableNames (intValue, value, value) VALUES ($intValue, $value, $value)"
//   );
//   for (const element in data) {
//     const result = await insertStatement.executeAsync({
//       $id: element.id,
//       $category: element.category,
//       $tableName: element.tableName,
//     });
//     try {
//     } finally {
//       await insertStatement.finalizeAsync();
//     }
//   }
// };

// import * as SQLite from "expo-sqlite";
// import { supabase } from "@/utils/supabase";
// import { useEffect } from "react";
// import Storage from "expo-sqlite/kv-store";

// type AllTableNamesType = {
//   id: number;
//   category: string;
//   tableName: string;
//   created_at: string;
// };

// type SingleAnswerType = {
//   id: number;
//   question: string;
//   title: string;
//   answer: string;
//   created_at: string;
// };

// type MultipleAnswereType = {
//   id: number;
//   question: string;
//   title: string;
//   answer_khamenei: string;
//   answer_sistani: string;
//   created_at: string;
// };

// export const manageData = () => {
//   useEffect(() => {
//     const compareVersions = async () => {
//       try {
//         // Fetch version from Supabase
//         const { data: versionData, error: versionError } = await supabase
//           .from("Version")
//           .select("version")
//           .single();

//         if (versionError) throw versionError;

//         if (versionData?.version) {
//           const versionInLocalDatabase = await Storage.getItem("version");

//           if (
//             !versionInLocalDatabase ||
//             versionInLocalDatabase !== versionData.version
//           ) {
//             // Version mismatch or first run - fetch and store all data
//             await fetchAndStoreAllTableNames();
//             await Storage.setItem("version", versionData.version);
//           }
//           // If versions match, continue using local data
//         }
//       } catch (error) {
//         console.error("Error comparing versions:", error);
//       }
//     };

//     compareVersions();
//   }, []);
// };

// export const fetchAndStoreAllTableNames = async () => {
//   try {
//     // Fetch data from Supabase
//     const { data, error } = await supabase.from("AllTableNames").select("*");

//     if (error) throw error;
//     if (!data) throw new Error("No data received from Supabase");

//     // Store in SQLite
//     await storeAllTableNamesInSql(data);

//     return data;
//   } catch (error) {
//     console.error("Error fetching table names:", error);
//   }
// };

// const storeAllTableNamesInSql = async (data: AllTableNamesType[]) => {
//   let db: SQLite.SQLiteDatabase | null = null;
//   let insertStatement: SQLite.SQLiteStatement | null = null;

//   try {
//     // Open database
//     db = await SQLite.openDatabaseAsync("islamFragenDatabase");

//     // Enable WAL mode and create table
//     await db.execAsync(`
//       PRAGMA journal_mode = WAL;
//       CREATE TABLE IF NOT EXISTS AllTableNames (
//         id INTEGER PRIMARY KEY NOT NULL,
//         category TEXT NOT NULL,
//         tableName TEXT NOT NULL,
//         created_at TEXT NOT NULL)
//       `);

//     // Clear existing data
//     await db.execAsync("DELETE FROM AllTableNames;");

//     // Prepare insert statement
//     insertStatement = await db.prepareAsync(
//       "INSERT INTO AllTableNames (id, category, tableName, created_at) VALUES ($id, $category, $tableName, $created_at)"
//     );

//     // Insert all records
//     for (const element of data) {
//       await insertStatement.executeAsync({
//         $id: element.id,
//         $category: element.category,
//         $tableName: element.tableName,
//         $created_at: element.created_at,
//       });
//     }
//   } catch (error) {
//     console.error("Error storing table names in SQLite:", error);
//     throw error;
//   } finally {
//     // Clean up resources
//     if (insertStatement) {
//       await insertStatement.finalizeAsync();
//     }
//     if (db) {
//       await db.closeAsync();
//     }
//   }
// };

// // Change
// export const fetchAndStoreQuestions = async () => {
//   const everyTableName = await getAllTableNamesFromSql();
//   try {
//     // Fetch data from Supabase
//     for (const table of everyTableName) {
//       const { data, error } = await supabase.from(`${table}`).select("*");
//       if (error) throw error;
//       if (!data)
//         throw new Error(`No data received from Supabase in table: ${table}`);

//       // Store in SQLite
//       await storeQuestions(data);
//       return data;
//     }
//   } catch (error) {
//     console.error("Error fetching table:", error);
//   }
// };

// // Change
// const storeQuestions = async (
//   data: SingleAnswerType[] | MultipleAnswereType[]
// ) => {
//   let db: SQLite.SQLiteDatabase | null = null;
//   const tableNames = getAllTableNamesFromSql();

//   try {
//     // Open database
//     db = await SQLite.openDatabaseAsync("islamFragenDatabase");

//     for (const table in tableNames) {
//       if (table === "Rechtsfragen") {
//         await db.execAsync(`
//           PRAGMA journal_mode = WAL;
//           CREATE TABLE IF NOT EXISTS ${table} (
//             id INTEGER PRIMARY KEY NOT NULL,
//             question TEXT NOT NULL,
//             title TEXT NOT NULL,
//             answer_sistani TEXT NOT NULL,
//             answer_khamenei TEXT NOT NULL,
//             created_at TEXT NOT NULL)
//           `);
//       } else {
//         await db.execAsync(`
//           PRAGMA journal_mode = WAL;
//           CREATE TABLE IF NOT EXISTS ${table} (
//             id INTEGER PRIMARY KEY NOT NULL,
//             question TEXT NOT NULL,
//             title TEXT NOT NULL,
//             answer TEXT NOT NULL,
//             created_at TEXT NOT NULL)
//           `);
//       }
//     }

//     // Prepare insert statement
//     const insertStatementSingleAnswers = await db.prepareAsync(
//       "INSERT INTO AllTableNames (id, question, title, answer, created_at) VALUES ($id, $question, $title, $answer, $created_at)"
//     );
//     const insertStatementMultipleAnswers = await db.prepareAsync(
//       "INSERT INTO AllTableNames (id, question, title,  answer_sistani, answer_khamenei,  created_at) VALUES ($id, $question, $title, $answer_sistani, $answer_khamenei, $created_at)"
//     );

//     // Insert all records
//     for (const element of data) {
//       await insertStatementSingleAnswers.executeAsync({
//         $id: element.id,
//         $title: element.title,
//         $question: element.question,
//         $answer: element.answer,
//         $created_at: element.created_at,
//       });
//     }
//   } catch (error) {
//     console.error("Error storing table names in SQLite:", error);
//     throw error;
//   } finally {
//     // Clean up resources
//     if (insertStatementSingleAnswers) {
//       await insertStatementSingleAnswers.finalizeAsync();
//     }
//     if (db) {
//       await db.closeAsync();
//     }
//   }
// };

// // Helper function to retrieve data from SQLite
// export const getAllTableNamesFromSql = async (): Promise<
//   AllTableNamesType[]
// > => {
//   let db: SQLite.SQLiteDatabase | null = null;

//   try {
//     db = await SQLite.openDatabaseAsync("islamFragenDatabase");
//     const result = await db.getAllAsync<AllTableNamesType>(
//       "SELECT * FROM AllTableNames ORDER BY category, tableName"
//     );
//     return result;
//   } catch (error) {
//     console.error("Error retrieving table names from SQLite:", error);
//     throw error;
//   } finally {
//     if (db) {
//       await db.closeAsync();
//     }
//   }
// };

// // Helper function to retrieve data from SQLite
// export const getAllQuestionsFromSql = async (table: string): Promise<
//   SingleAnswerType[] | MultipleAnswereType[]
// > => {
//   let db: SQLite.SQLiteDatabase | null = null;

//   try {
//     db = await SQLite.openDatabaseAsync("islamFragenDatabase");
//     const result = await db.getAllAsync<SingleAnswerType[] | MultipleAnswereType []>(
//       `SELECT * FROM ${table} ORDER BY title`
//     );
//     return result;
//   } catch (error) {
//     console.error("Error retrieving table from SQLite:", error);
//     throw error;
//   } finally {
//     if (db) {
//       await db.closeAsync();
//     }
//   }
// };

// import * as SQLite from "expo-sqlite";
// import { supabase } from "@/utils/supabase";
// import { useEffect } from "react";
// import Storage from "expo-sqlite/kv-store";

// type AllTableNamesType = {
//   id: number;
//   category: string;
//   tableName: string;
//   created_at: string;
// };

// type SingleAnswerType = {
//   id: number;
//   question: string;
//   title: string;
//   answer: string;
//   created_at: string;
// };

// type MultipleAnswerType = {
//   id: number;
//   question: string;
//   title: string;
//   answer_khamenei: string;
//   answer_sistani: string;
//   created_at: string;
// };

// // Open or create the database

// const getDatabase = async () => {
//   return SQLite.openDatabaseAsync("islamFragenDatabase.db");
// };

// const validateTableName = (name: string): boolean => {
//   return /^[a-zA-Z0-9_]+$/.test(name);
// };

// // Manage data on component load
// export const manageData = () => {
//   useEffect(() => {
//     const compareVersions = async () => {
//       try {
//         // Fetch version from Supabase
//         const { data: versionData, error: versionError } = await supabase
//           .from("Version")
//           .select("version")
//           .single();

//         if (versionError) throw versionError;

//         const versionInLocalDatabase = await Storage.getItem("version");
//         if (
//           !versionInLocalDatabase ||
//           versionInLocalDatabase !== versionData?.version
//         ) {
//           console.log("Updating database...");
//           // Step 2: Fetch and store table names
//           await fetchAndStoreAllTableNames();
//           // Step 3: Fetch and store questions for all tables
//           await fetchAndStoreQuestions();
//           // Step 4: Update local version
//           await Storage.setItem("version", versionData?.version);
//           console.log("Database update completed.");
//         }
//       } catch (error) {
//         console.error("Error comparing versions:", error);
//       }
//     };

//     compareVersions();
//   }, []);
// };

// // Fetch and store all table names
// export const fetchAndStoreAllTableNames = async () => {
//   const db = await getDatabase();
//   try {
//     const { data, error } = await supabase.from("AllTableNames").select("*");
//     if (error) throw error;
//     if (!data) throw new Error("No data received from Supabase");
//     await storeAllTableNamesInSql(data);
//   } catch (error) {
//     console.error("Error fetching table names:", error);
//   }
// };

// // Store table names in SQLite
// const storeAllTableNamesInSql = async (data: AllTableNamesType[]) => {
//   try {
//     // Create table if not exists
//     const db = await getDatabase();
//     await db.execAsync(`
//       PRAGMA journal_mode = WAL;
//       CREATE TABLE IF NOT EXISTS AllTableNames (
//         id INTEGER PRIMARY KEY NOT NULL,
//         category TEXT NOT NULL,
//         tableName TEXT NOT NULL,
//         created_at TEXT NOT NULL
//       );
//     `);

//     // Clear existing data
//     await db.execAsync("DELETE FROM AllTableNames;");

//     // Insert new data

//     await db.withTransactionAsync(async (txn) => {
//       for (const item of data) {
//         await txn.runAsync(
//           `INSERT INTO AllTableNames (id, category, tableName, created_at)
//            VALUES (?, ?, ?, ?)`,
//           item.id,
//           item.category,
//           item.tableName,
//           item.created_at
//         );
//       }
//     });
//   } catch (error) {
//     console.error("Error storing table names in SQLite:", error);
//   }
// };

// // Fetch and store questions from all tables
// export const fetchAndStoreQuestions = async () => {
//   const db = await getDatabase();
//   const tableNames = await getAllTableNamesFromSql();

//   for (const table of tableNames) {
//     try {
//       if (!validateTableName(table.tableName)) {
//         throw new Error(`Invalid table name: ${table.tableName}`);
//       }
//       const { data, error } = await supabase.from(table.tableName).select("*");
//       if (error) throw error;
//       if (!data)
//         throw new Error(
//           `No data received from Supabase in table: ${table.tableName}`
//         );
//       await storeQuestions(table.tableName, data);
//     } catch (error) {
//       console.error(`Error fetching table ${table.tableName}:`, error);
//     }
//   }
// };

// // Store questions in SQLite
// const storeQuestions = async (
//   tableName: string,
//   data: SingleAnswerType[] | MultipleAnswerType[]
// ) => {
//   const db = await getDatabase();
//   try {
//     const isMultipleAnswerTable = tableName === "Rechtsfragen";

//     // Create table if not exists
//     await db.execAsync(`
//       PRAGMA journal_mode = WAL;
//       CREATE TABLE IF NOT EXISTS ${tableName} (
//         id INTEGER PRIMARY KEY NOT NULL,
//         question TEXT NOT NULL,
//         title TEXT NOT NULL,
//         ${
//           isMultipleAnswerTable
//             ? "answer_khamenei TEXT NOT NULL, answer_sistani TEXT NOT NULL"
//             : "answer TEXT NOT NULL"
//         },
//         created_at TEXT NOT NULL
//       );
//     `);

//     await db.withTransactionAsync(async (txn) => {
//       for (const item of data) {
//         await txn.runAsync(
//           isMultipleAnswerTable
//             ? `INSERT INTO ${tableName} (id, question, title, answer_khamenei, answer_sistani, created_at)
//                  VALUES (?, ?, ?, ?, ?, ?)`
//             : `INSERT INTO ${tableName} (id, question, title, answer, created_at)
//                  VALUES (?, ?, ?, ?, ?)`,
//           item.id,
//           item.question,
//           item.title,
//           isMultipleAnswerTable
//             ? (item as MultipleAnswerType).answer_khamenei
//             : (item as SingleAnswerType).answer,
//           isMultipleAnswerTable
//             ? (item as MultipleAnswerType).answer_sistani
//             : null,
//           item.created_at
//         );
//       }
//     });
//   } catch (error) {
//     console.error(`Error storing questions in ${tableName}:`, error);
//   }
// };

// // Get all table names from SQLite
// export const getAllTableNamesFromSql = async (): Promise<
//   AllTableNamesType[]
// > => {
//   try {
//     const db = await getDatabase();
//     return await db.getAllAsync(
//       "SELECT * FROM AllTableNames ORDER BY category, tableName;"
//     );
//   } catch (error) {
//     console.error("Error retrieving table names from SQLite:", error);
//     return [];
//   }
// };

// // Get all questions from a specific table
// export const getAllQuestionsFromSql = async (
//   tableName: string
// ): Promise<SingleAnswerType[] | MultipleAnswerType[]> => {
//   const db = await getDatabase();
//   try {
//     return await db.getAllAsync(`SELECT * FROM ${tableName} ORDER BY title;`);
//   } catch (error) {
//     console.error(`Error retrieving questions from ${tableName}:`, error);
//     return [];
//   }
// };


// import * as SQLite from "expo-sqlite";
// import { supabase } from "@/utils/supabase";
// import { useEffect, useState } from "react";
// import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";

// // Constants
// const SETUP_KEY = "database_initialized";
// const DATABASE_NAME = "qaDatabase.db";

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
//   tableName: string;
//   question: string;
//   answer: string;
//   created_at: string;
// };

// export type QuestionAnswerPerMarjaType = {
//   id: number;
//   category: string;
//   tableName: string;
//   question: string;
//   answer_sistani: string;
//   answer_khamenei: string;
//   created_at: string;
// };

// // Database initialization function
// async function migrateDbIfNeeded(db: SQLite.SQLiteDatabase) {
//   const DATABASE_VERSION = 1;
//   const { user_version: currentVersion } = await db.getFirstAsync<{ user_version: number }>(
//     "PRAGMA user_version"
//   );

//   if (currentVersion < DATABASE_VERSION) {
//     await db.execAsync(`
//       PRAGMA journal_mode = WAL;

//       CREATE TABLE IF NOT EXISTS AllTableNames (
//         id INTEGER PRIMARY KEY,
//         category TEXT,
//         tableName TEXT,
//         created_at TEXT
//       );

//       CREATE TABLE IF NOT EXISTS QuestionsOneAnswer (
//         id INTEGER PRIMARY KEY,
//         tableName TEXT,
//         category TEXT,
//         question TEXT,
//         title TEXT,
//         answer TEXT,
//         created_at TEXT
//       );

//       CREATE TABLE IF NOT EXISTS QuestionsMarjaAnswer (
//         id INTEGER PRIMARY KEY,
//         tableName TEXT,
//         category TEXT,
//         question TEXT,
//         title TEXT,
//         answer_sistani TEXT,
//         answer_khamenei TEXT,
//         created_at TEXT
//       );
//     `);

//     // Update database version
//     await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
//   }
// }

// // Store table names
// const storeTableNames = async (db: SQLite.SQLiteDatabase, data: AllTableNamesType[]) => {
//   const statement = await db.prepareAsync("INSERT INTO AllTableNames (id, category, tableName, created_at) VALUES (?, ?, ?, ?)");
//   try {
//     await db.runAsync("DELETE FROM AllTableNames;");
//     for (const item of data) {
//       await statement.executeAsync([item.id, item.category, item.tableName, item.created_at]);
//     }
//   } finally {
//     await statement.finalizeAsync();
//   }
// };

// // Store Q&A data
// const storeQAData = async (
//   db: SQLite.SQLiteDatabase,
//   tableName: string,
//   category: string,
//   isMarjaTable: boolean,
//   data: QuestionOneAnswerType[] | QuestionAnswerPerMarjaType[]
// ) => {
//   await db.withTransactionAsync(async () => {
//     if (isMarjaTable) {
//       await db.runAsync("DELETE FROM QuestionsMarjaAnswer WHERE tableName = ?;", [tableName]);
//       const statement = await db.prepareAsync(
//         `INSERT OR REPLACE INTO QuestionsMarjaAnswer 
//         (id, tableName, category, question, title, answer_sistani, answer_khamenei, created_at) 
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
//       );
//       try {
//         for (const item of data as QuestionAnswerPerMarjaType[]) {
//           await statement.executeAsync([
//             item.id,
//             tableName,
//             category,
//             item.question,
//             item.answer_sistani,
//             item.answer_khamenei,
//             item.created_at,
//           ]);
//         }
//       } finally {
//         await statement.finalizeAsync();
//       }
//     } else {
//       await db.runAsync("DELETE FROM QuestionsOneAnswer WHERE tableName = ?;", [tableName]);
//       const statement = await db.prepareAsync(
//         `INSERT OR REPLACE INTO QuestionsOneAnswer 
//         (id, tableName, category, question, title, answer, created_at) 
//         VALUES (?, ?, ?, ?, ?, ?, ?);`
//       );
//       try {
//         for (const item of data as QuestionOneAnswerType[]) {
//           await statement.executeAsync([
//             item.id,
//             tableName,
//             category,
//             item.question,
//             item.answer,
//             item.created_at,
//           ]);
//         }
//       } finally {
//         await statement.finalizeAsync();
//       }
//     }
//   });
// };

// // React hook to use the database
// export const useQADatabase = () => {
//   const db = useSQLiteContext();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);

//   const getTablesByCategory = async (category: string) => {
//     try {
//       return await db.getAllAsync<AllTableNamesType>(
//         "SELECT * FROM AllTableNames WHERE category = ? ORDER BY tableName;",
//         [category]
//       );
//     } catch (err) {
//       console.error("Error getting tables by category:", err);
//       throw err;
//     }
//   };

//   const getQuestionsForTable = async (tableName: string, category: string) => {
//     const isMarjaTable = category === "Rechtsfragen";
//     try {
//       return await db.getAllAsync<QuestionOneAnswerType | QuestionAnswerPerMarjaType>(
//         `SELECT * FROM ${
//           isMarjaTable ? "QuestionsMarjaAnswer" : "QuestionsOneAnswer"
//         } WHERE tableName = ? ORDER BY created_at;`,
//         [tableName]
//       );
//     } catch (err) {
//       console.error("Error getting questions for table:", err);
//       throw err;
//     }
//   };

//   useEffect(() => {
//     const initializeDatabase = async () => {
//       try {
//         setLoading(true);
//         const { data: allTableNames, error: tableError } = await supabase
//           .from("AllTableNames")
//           .select("*")
//           .order("category", { ascending: true });

//         if (tableError) throw tableError;

//         await storeTableNames(db, allTableNames);

//         for (const table of allTableNames) {
//           const isMarjaTable = table.category === "Rechtsfragen";
//           const { data: qaData, error: qaError } = await supabase
//             .from(table.tableName)
//             .select("*")
//             .order("created_at", { ascending: true });

//           if (qaError) throw qaError;
//           await storeQAData(db, table.tableName, table.category, isMarjaTable, qaData);
//         }
//       } catch (err) {
//         console.error("Error initializing database:", err);
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeDatabase();
//   }, [db]);

//   return { loading, error, getTablesByCategory, getQuestionsForTable };
// };


// import { SQLiteDatabase } from 'expo-sqlite';
// import { supabase } from "@/utils/supabase";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// // Types
// export type AllTableNamesType = {
//   id: number;
//   category: string;
//   tableName: string;
//   created_at: string;
// };

// export type QuestionOneAnswerType = {
//   id: number;
//   tableName: string;
//   category: string;
//   question: string;
//   title: string;
//   answer: string;
//   created_at: string;
// };

// export type QuestionAnswerPerMarjaType = {
//   id: number;
//   tableName: string;
//   category: string;
//   question: string;
//   title: string;
//   answer_sistani: string;
//   answer_khamenei: string;
//   created_at: string;
// };

// const DB_VERSION_KEY = 'db_version';

// export async function migrateDbIfNeeded(db: SQLiteDatabase) {
//   const DATABASE_VERSION = 1;
//   const { user_version: currentVersion } = await db.getFirstAsync<{ user_version: number }>(
//     'PRAGMA user_version'
//   );

//   if (currentVersion < DATABASE_VERSION) {
//     await db.execAsync(`
//       PRAGMA journal_mode = WAL;

//       CREATE TABLE IF NOT EXISTS AllTableNames (
//         id INTEGER PRIMARY KEY,
//         category TEXT,
//         tableName TEXT,
//         created_at TEXT
//       );

//       CREATE TABLE IF NOT EXISTS QuestionsOneAnswer (
//         id INTEGER PRIMARY KEY,
//         tableName TEXT,
//         category TEXT,
//         question TEXT,
//         title TEXT,
//         answer TEXT,
//         created_at TEXT
//       );

//       CREATE TABLE IF NOT EXISTS QuestionsMarjaAnswer (
//         id INTEGER PRIMARY KEY,
//         tableName TEXT,
//         category TEXT,
//         question TEXT,
//         title TEXT,
//         answer_sistani TEXT,
//         answer_khamenei TEXT,
//         created_at TEXT
//       );

//       CREATE TABLE IF NOT EXISTS Version (
//         version TEXT PRIMARY KEY
//       );
//     `);

//     await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
//   }
// }

// export class DatabaseService {
//   private db: SQLiteDatabase;
//   private subscriptions: { [key: string]: any } = {};

//   constructor(db: SQLiteDatabase) {
//     this.db = db;
//   }

//   async initialize() {
//     const shouldSync = await this.shouldSyncDatabase();
//     if (shouldSync) {
//       await this.syncDatabase();
//       await this.setupSubscriptions();
//     }
//   }

//   private async shouldSyncDatabase(): Promise<boolean> {
//     try {
//       const storedVersion = await AsyncStorage.getItem(DB_VERSION_KEY);
//       const { data: versionData, error } = await supabase
//         .from('Version')
//         .select('version')
//         .single();

//       if (error) throw error;
//       return !storedVersion || storedVersion !== versionData?.version;
//     } catch (error) {
//       console.error('Error checking database version:', error);
//       return true; // Sync on error to be safe
//     }
//   }

//   private async syncDatabase() {
//     await this.db.withTransactionAsync(async () => {
//       try {
//         const { data: allTableNames, error: tableError } = await supabase
//           .from("AllTableNames")
//           .select("*")
//           .order("category");

//         if (tableError) throw tableError;
//         if (!allTableNames) return;

//         // Clear existing data
//         await this.db.execAsync('DELETE FROM AllTableNames');
//         await this.db.execAsync('DELETE FROM QuestionsOneAnswer');
//         await this.db.execAsync('DELETE FROM QuestionsMarjaAnswer');

//         // Store table names
//         const tableStatement = await this.db.prepareAsync(
//           'INSERT INTO AllTableNames (id, category, tableName, created_at) VALUES (?, ?, ?, ?)'
//         );

//         try {
//           for (const item of allTableNames) {
//             await tableStatement.executeAsync([item.id, item.category, item.tableName, item.created_at]);
//           }
//         } finally {
//           await tableStatement.finalizeAsync();
//         }

//         // Store data for each table
//         for (const table of allTableNames) {
//           const { data: qaData, error: qaError } = await supabase
//             .from(table.tableName)
//             .select("*")
//             .order("created_at");

//           if (qaError) throw qaError;
//           if (!qaData) continue;

//           const isMarjaTable = table.category === "Rechtsfragen";
//           const statement = await this.db.prepareAsync(
//             isMarjaTable
//               ? `INSERT INTO QuestionsMarjaAnswer 
//                  (id, tableName, category, question, title, answer_sistani, answer_khamenei, created_at)
//                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
//               : `INSERT INTO QuestionsOneAnswer 
//                  (id, tableName, category, question, title, answer, created_at)
//                  VALUES (?, ?, ?, ?, ?, ?, ?)`
//           );

//           try {
//             for (const item of qaData) {
//               if (isMarjaTable) {
//                 await statement.executeAsync([
//                   item.id,
//                   table.tableName,
//                   table.category,
//                   item.question,
//                   item.title,
//                   item.answer_sistani,
//                   item.answer_khamenei,
//                   item.created_at,
//                 ]);
//               } else {
//                 await statement.executeAsync([
//                   item.id,
//                   table.tableName,
//                   table.category,
//                   item.question,
//                   item.title,
//                   item.answer,
//                   item.created_at,
//                 ]);
//               }
//             }
//           } finally {
//             await statement.finalizeAsync();
//           }
//         }

//         // Update version
//         const { data: versionData } = await supabase.from('Version').select('version').single();
//         if (versionData) {
//           await AsyncStorage.setItem(DB_VERSION_KEY, versionData.version);
//         }
//       } catch (error) {
//         console.error('Error syncing database:', error);
//         throw error;
//       }
//     });
//   }

//   private async setupSubscriptions() {
//     // Subscribe to Version table
//     this.subscriptions.version = supabase
//       .channel('version-changes')
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'Version' },
//         async () => {
//           await this.syncDatabase();
//         })
//       .subscribe();

//     const { data: tables } = await supabase.from('AllTableNames').select('tableName');
//     if (tables) {
//       tables.forEach(({ tableName }) => {
//         this.subscriptions[tableName] = supabase
//           .channel(`${tableName}-changes`)
//           .on('postgres_changes', { event: '*', schema: 'public', table: tableName },
//             async () => {
//               await this.syncDatabase();
//             })
//           .subscribe();
//       });
//     }
//   }

//   async getTablesByCategory(category: string): Promise<AllTableNamesType[]> {
//     return await this.db.getAllAsync<AllTableNamesType>(
//       'SELECT * FROM AllTableNames WHERE category = ? ORDER BY tableName',
//       [category]
//     );
//   }

//   async getQuestionsForTable(tableName: string, category: string) {
//     const isMarjaTable = category === "Rechtsfragen";
//     const table = isMarjaTable ? "QuestionsMarjaAnswer" : "QuestionsOneAnswer";
    
//     return await this.db.getAllAsync(
//       `SELECT * FROM ${table} WHERE tableName = ? ORDER BY created_at`,
//       [tableName]
//     );
//   }

//   cleanup() {
//     Object.values(this.subscriptions).forEach(subscription => {
//       if (subscription?.unsubscribe) {
//         subscription.unsubscribe();
//       }
//     });
//   }
// }
// database-service.ts
// database-service.ts

// database.ts
import { SQLiteDatabase } from 'expo-sqlite';
import { supabase } from "@/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Types
export type AllTableNamesType = {
  id: number;
  category: string;
  tableName: string;
  created_at: string;
};

export type QuestionOneAnswerType = {
  id: number;
  tableName: string;
  category: string;
  question: string;
  title: string;
  answer: string;
  created_at: string;
};

export type QuestionAnswerPerMarjaType = {
  id: number;
  tableName: string;
  category: string;
  question: string;
  title: string;
  answer_sistani: string;
  answer_khamenei: string;
  created_at: string;
};

// Constants
const DB_VERSION_KEY = 'db_version';
let subscriptions: { [key: string]: any } = {};

// Schema migration
export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  console.log('Checking database schema version...');
  const DATABASE_VERSION = 1;
  
  const { user_version: currentVersion } = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );

  if (currentVersion < DATABASE_VERSION) {
    console.log('Migrating database schema...');
    await db.execAsync(`
      PRAGMA foreign_keys = OFF;
      BEGIN TRANSACTION;

      DROP TABLE IF EXISTS AllTableNames;
      DROP TABLE IF EXISTS QuestionsOneAnswer;
      DROP TABLE IF EXISTS QuestionsMarjaAnswer;
      DROP TABLE IF EXISTS Version;

      CREATE TABLE AllTableNames (
        id INTEGER PRIMARY KEY,
        category TEXT NOT NULL,
        tableName TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL
      );

      CREATE TABLE QuestionsOneAnswer (
        id INTEGER PRIMARY KEY,
        tableName TEXT NOT NULL,
        category TEXT NOT NULL,
        question TEXT NOT NULL,
        title TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (tableName) REFERENCES AllTableNames(tableName) ON DELETE CASCADE
      );

      CREATE TABLE QuestionsMarjaAnswer (
        id INTEGER PRIMARY KEY,
        tableName TEXT NOT NULL,
        category TEXT NOT NULL,
        question TEXT NOT NULL,
        title TEXT NOT NULL,
        answer_sistani TEXT NOT NULL,
        answer_khamenei TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (tableName) REFERENCES AllTableNames(tableName) ON DELETE CASCADE
      );

      CREATE TABLE Version (
        version TEXT PRIMARY KEY
      );

      PRAGMA user_version = ${DATABASE_VERSION};
      COMMIT;
      PRAGMA foreign_keys = ON;
    `);
    console.log('Schema migration complete');
  }
}

// Check if database needs sync
async function shouldSyncDatabase(): Promise<boolean> {
  try {
    const storedVersion = await AsyncStorage.getItem(DB_VERSION_KEY);
    const { data: versionData, error } = await supabase
      .from('Version')
      .select('version')
      .single();

    if (error) throw error;
    const needsSync = !storedVersion || storedVersion !== versionData?.version;
    console.log(`Database sync needed: ${needsSync}`);
    return needsSync;
  } catch (error) {
    console.error('Error checking database version:', error);
    return true; // Sync on error to be safe
  }
}

// Sync database
async function syncDatabase(db: SQLiteDatabase) {
  console.log('Starting database sync...');
  try {
    // Start Transaction
    await db.execAsync('BEGIN TRANSACTION');

    // Clear all existing data first
    await db.execAsync('DELETE FROM AllTableNames');
    await db.execAsync('DELETE FROM QuestionsOneAnswer');
    await db.execAsync('DELETE FROM QuestionsMarjaAnswer');

    // Fetch all tables
    console.log('Fetching tables from Supabase...');
    const { data: allTableNames, error: tableError } = await supabase
      .from("AllTableNames")
      .select("*")
      .order("category");

    if (tableError) throw tableError;
    if (!allTableNames) {
      console.log('No tables found in Supabase');
      await db.execAsync('COMMIT');
      return;
    }

    console.log(`Found ${allTableNames.length} tables in Supabase`);

    // Store table names
    for (const table of allTableNames) {
      await db.runAsync(
        'INSERT INTO AllTableNames (id, category, tableName, created_at) VALUES (?, ?, ?, ?)',
        [table.id, table.category, table.tableName, table.created_at]
      );
    }
    console.log('Table names stored in SQLite');

    // Store Q&A data
    for (const table of allTableNames) {
      console.log(`Syncing data for ${table.tableName}...`);
      
      const { data: qaData, error: qaError } = await supabase
        .from(table.tableName)
        .select("*")
        .order("created_at");

      if (qaError) {
        console.error(`Error fetching data for ${table.tableName}:`, qaError);
        continue;
      }

      if (!qaData || qaData.length === 0) {
        console.log(`No data found for ${table.tableName}`);
        continue;
      }

      const isMarjaTable = table.category === "Rechtsfragen";
      
      // For each table, first delete existing data
      if (isMarjaTable) {
        await db.runAsync('DELETE FROM QuestionsMarjaAnswer WHERE tableName = ?', [table.tableName]);
      } else {
        await db.runAsync('DELETE FROM QuestionsOneAnswer WHERE tableName = ?', [table.tableName]);
      }

      // Then insert new data
      let insertedCount = 0;
      for (const item of qaData) {
        try {
          if (isMarjaTable) {
            await db.runAsync(
              `INSERT INTO QuestionsMarjaAnswer 
              (id, tableName, category, question, title, answer_sistani, answer_khamenei, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                item.id,
                table.tableName,
                table.category,
                item.question || '',
                item.title || '',
                item.answer_sistani || '',
                item.answer_khamenei || '',
                item.created_at,
              ]
            );
          } else {
            await db.runAsync(
              `INSERT INTO QuestionsOneAnswer 
              (id, tableName, category, question, title, answer, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                item.id,
                table.tableName,
                table.category,
                item.question || '',
                item.title || '',
                item.answer || '',
                item.created_at,
              ]
            );
          }
          insertedCount++;
        } catch (insertError) {
          console.error(`Error inserting data for ${table.tableName}:`, insertError);
        }
      }
      console.log(`Successfully inserted ${insertedCount} records for ${table.tableName}`);
    }

    // Update version
    const { data: versionData } = await supabase.from('Version').select('version').single();
    if (versionData) {
      await AsyncStorage.setItem(DB_VERSION_KEY, versionData.version);
    }

    // Commit transaction
    await db.execAsync('COMMIT');
    console.log('Database sync completed successfully');

  } catch (error) {
    // Rollback on error
    console.error('Error during sync:', error);
    await db.execAsync('ROLLBACK');
    throw error;
  }
}

// Setup Supabase subscriptions
async function setupSubscriptions(db: SQLiteDatabase) {
  console.log('Setting up Supabase subscriptions...');
  cleanupSubscriptions();

  // Subscribe to Version table
  subscriptions.version = supabase
    .channel('version-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'Version' },
      async () => {
        console.log('Version change detected, syncing database...');
        await syncDatabase(db);
      })
    .subscribe();

  // Subscribe to individual tables
  const { data: tables } = await supabase.from('AllTableNames').select('tableName');
  if (tables) {
    tables.forEach(({ tableName }) => {
      subscriptions[tableName] = supabase
        .channel(`${tableName}-changes`)
        .on('postgres_changes', { event: '*', schema: 'public', table: tableName },
          async () => {
            console.log(`Change detected in ${tableName}, syncing database...`);
            await syncDatabase(db);
          })
        .subscribe();
    });
  }
}

// Initialize database
export async function initializeDatabase(db: SQLiteDatabase) {
  console.log('Starting database initialization...');
  
  await migrateDbIfNeeded(db);
  
  const needsSync = await shouldSyncDatabase();
  if (needsSync) {
    await syncDatabase(db);
    await setupSubscriptions(db);
  }
  
  console.log('Database initialization complete');
}

// Get tables by category
export async function getTablesByCategory(db: SQLiteDatabase, category: string): Promise<AllTableNamesType[]> {
  console.log(`Getting tables for category: ${category}`);
  
  try {
    const tables = await db.getAllAsync<AllTableNamesType>(
      'SELECT * FROM AllTableNames WHERE category = ? ORDER BY tableName',
      [category]
    );
    console.log(`Found ${tables.length} tables for ${category}`);
    return tables;
  } catch (error) {
    console.error(`Error getting tables for ${category}:`, error);
    return [];
  }
}

// Get questions for table
export async function getQuestionsForTable(db: SQLiteDatabase, tableName: string, category: string) {
  console.log(`Getting questions for ${tableName} (${category})`);
  
  try {
    const isMarjaTable = category === "Rechtsfragen";
    const table = isMarjaTable ? "QuestionsMarjaAnswer" : "QuestionsOneAnswer";
    
    const questions = await db.getAllAsync(
      `SELECT * FROM ${table} WHERE tableName = ? ORDER BY created_at`,
      [tableName]
    );
    
    console.log(`Found ${questions.length} questions for ${tableName}`);
    return questions;
  } catch (error) {
    console.error(`Error getting questions for ${tableName}:`, error);
    return [];
  }
}

// Cleanup subscriptions
export function cleanupSubscriptions() {
  console.log('Cleaning up subscriptions...');
  Object.values(subscriptions).forEach(subscription => {
    if (subscription?.unsubscribe) {
      subscription.unsubscribe();
    }
  });
  subscriptions = {};
}