import * as SQLite from "expo-sqlite";
import { supabase } from "@/utils/supabase";
import Storage from "expo-sqlite/kv-store";

export type QuestionType = {
  id: number;
  title: string;
  question: string;
  answer: string;
  answer_sistani: string;
  answer_khamenei: string;
  category_name: string;
  subcategory_name: string;
  created_at: string;
};

export const initializeDatabase = async () => {
  // Check if version in Storage is up to date
  const checkVersion = async () => {
    const versionFromStorage = await Storage.getItem("version");
    const versionFromSupabase = await fetchVersionFromSupabase();

    if (versionFromStorage !== versionFromSupabase) {
      await fetchQuestionsFromSupabase();
      await Storage.setItem("version", versionFromSupabase);
    }
  };
  await checkVersion();
  setupSubscriptions();
};

const fetchVersionFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from("version")
      .select("version")
      .single();

    if (error) {
      console.error(error);
      return;
    }
    return data.version;
  } catch (error) {
    console.error(error);
  }
};

const fetchQuestionsFromSupabase = async () => {
  try {
    // Fetch questions from Supabase
    const { data: questions, error } = await supabase
      .from("question")
      .select("*");

    if (error) {
      console.error("Error fetching questions from Supabase:", error.message);
      return;
    }

    if (!questions || questions.length === 0) {
      console.log("No questions found in Supabase.");
      return;
    }

    // Open SQLite database
    const db = await SQLite.openDatabaseAsync("islam-fragen.db");

    // Create the questions table if it doesn't exist
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS question (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        question TEXT UNIQUE NOT NULL,
        answer TEXT,
        answer_sistani TEXT,
        answer_khamenei TEXT,
        category_name TEXT REFERENCES category(category_name),
        subcategory_name TEXT REFERENCES subcategory(subcategory_name),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Use an exclusive transaction for batch insertion
    // !! Maybe change -> withTransactionAsync instead of withExclusiveTransactionAsync
    await db.withExclusiveTransactionAsync(async (txn) => {
      // Prepare the statement inside the transaction
      const statement = await txn.prepareAsync(`
        INSERT OR REPLACE INTO question 
        (id, title, question, answer, answer_sistani, answer_khamenei, category_name, subcategory_name, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
      `);

      try {
        // Execute the prepared statement for each question
        for (const question of questions) {
          await statement.executeAsync([
            question.id,
            question.title,
            question.question,
            question.answer || null,
            question.answer_sistani || null,
            question.answer_khamenei || null,
            question.category_name,
            question.subcategory_name,
            question.created_at,
          ]);
        }
      } finally {
        // Finalize the prepared statement
        await statement.finalizeAsync();
      }
    });

    console.log("Questions successfully synced to SQLite.");
  } catch (error) {
    console.error("Unexpected error in fetchQuestionsFromSupabase:", error);
  }
};

const setupSubscriptions = () => {
  // Subscribe to changes in the `version` table
  supabase
    .channel("version")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "version" },
      async (payload) => {
        try {
          console.log("Change received!", payload);
          await initializeDatabase(); // Re-fetch data if version changes
        } catch (error) {
          console.error("Error handling Supabase subscription change:", error);
        }
      }
    )
    .subscribe();

  // Subscribe to changes in the `questions` table
  supabase
    .channel("question")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "question" },
      async (payload) => {
        try {
          // Update SQLite database based on the operation
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            const change = payload.new as QuestionType;
            await syncSingleQuestion(change);
          } else if (payload.eventType === "DELETE") {
            await deleteQuestionFromSQLite(payload.old.id);
          }
        } catch (error) {
          console.error("Error handling Supabase subscription change:", error);
        }
      }
    )
    .subscribe();
};

const syncSingleQuestion = async (question: QuestionType) => {
  const db = await SQLite.openDatabaseAsync("islam-fragen.db");
  await db.runAsync(
    `
    INSERT OR REPLACE INTO question
    (id, title, question, answer, answer_sistani, answer_khamenei, category_name, subcategory_name, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      question.id,
      question.title,
      question.question,
      question.answer,
      question.answer_sistani,
      question.answer_khamenei,
      question.category_name,
      question.subcategory_name,
      question.created_at,
    ]
  );
  console.log("Question synced:", question.id);
};

const deleteQuestionFromSQLite = async (questionId: number) => {
  const db = await SQLite.openDatabaseAsync("islam-fragen.db");
  await db.runAsync(`DELETE FROM question WHERE id = ?;`, [questionId]);
  console.log("Question deleted:", questionId);
};

// get the subcategories from the SQLite database
export const getSubcategoriesForCategory = async (
  categoryName: string
): Promise<string[]> => {
  try {
    const db = await SQLite.openDatabaseAsync("islam-fragen.db");
    const rows = await db.getAllAsync<{ subcategory_name: string }>(
      "SELECT DISTINCT subcategory_name FROM question WHERE category_name = ?;",
      [categoryName]
    );
    // Only unique subcategories are returned because of "DISTINCT"
    return rows.map((row) => row.subcategory_name);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

export const getQuestionsForSubcategory = async (
  categoryName: string,
  subcategoryName: string
): Promise<QuestionType[]> => {
  try {
    const db = await SQLite.openDatabaseAsync("islam-fragen.db");

    // Query to fetch questions for the given subcategory
    const rows = await db.getAllAsync<QuestionType>(
      "SELECT * FROM question WHERE category_name = ? AND subcategory_name = ?;",
      [categoryName, subcategoryName]
    );

    return rows; // Return the fetched rows
  } catch (error) {
    console.error("Error fetching questions for subcategory:", error);
    throw error;
  }
};

export const getQuestion = async (
  categoryName: string,
  subcategoryName: string,
  questionId: number
): Promise<QuestionType> => {
  try {
    const db = await SQLite.openDatabaseAsync("islam-fragen.db");

    // Query to fetch questions for the given subcategory
    const rows = await db.getAllAsync<QuestionType>(
      "SELECT * FROM question WHERE category_name = ? AND subcategory_name = ? AND id = ? LIMIT 1;",
      [categoryName, subcategoryName, questionId,]
    );
    return rows[0]
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
};

export const searchQuestions = async (
  searchTerm: string
): Promise<
  { category_name: string; subcategory_name: string; question: string }[]
> => {
  try {
    const db = await SQLite.openDatabaseAsync("islam-fragen.db");

    // Perform a search query using the LIKE operator
    const rows = await db.getAllAsync<{
      category_name: string;
      subcategory_name: string;
      question: string;
    }>(
      `
      SELECT category_name, subcategory_name, question
      FROM question
      WHERE question LIKE ?;
      `,
      [`%${searchTerm}%`] // Surround the search term with % for pattern matching
    );

    return rows; // Return the matching rows
  } catch (error) {
    console.error("Error searching questions:", error);
    throw error;
  }
};