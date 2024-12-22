import * as SQLite from "expo-sqlite";
import { SubcategoriesType, QuestionsAnswersMarjaType } from "./types";

let db: SQLite.SQLiteDatabase;

export const openDb = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("QuestionAnswersMarja.db");
  }
  return db;
};

export const initDatabase = async () => {
  const db = await openDb();
  await db.execAsync("PRAGMA journal_mode = WAL"); // Handles multiple reads/writes efficiently -> Standard
};

export const createTableForCategory = async (category: string) => {
  const db = await openDb();
  await db.execAsync(`
      CREATE TABLE IF NOT EXISTS "${category}" (
        id INTEGER PRIMARY KEY NOT NULL,
       title TEXT NOT NULL
      )
    `);
};
