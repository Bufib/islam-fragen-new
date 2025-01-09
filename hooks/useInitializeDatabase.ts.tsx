import { useEffect, useState } from "react";
import { initializeDatabase } from "@/utils/initializeDatabase";

export function useInitializeDatabase() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeDatabase();
        console.log("Database initialized successfully.");
        // Mark initialization as complete
        setInitialized(true);
      } catch (error) {
        console.error("Error initializing database:", error);
        setInitialized(false);
      }
    };

    initialize();
  }, []);

  return initialized;
}
