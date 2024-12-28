import { useEffect, useState } from "react";
import { initializeDatabase } from "@/components/initializeDatabase";

export function useInitializeDatabase() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeDatabase();
        console.log("Database initialized successfully.");
        setInitialized(true); // Mark initialization as complete
      } catch (error) {
        console.error("Error initializing database:", error);
        setInitialized(false);
      }
    };

    initialize();
  }, []);

  return initialized;
}
