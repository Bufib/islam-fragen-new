// import { useEffect, useState } from "react";
// import { initializeDatabase } from "@/utils/initializeDatabase";

// export function useInitializeDatabase() {
//   const [initialized, setInitialized] = useState(false);

//   useEffect(() => {
//     const initialize = async () => {
//       try {
//         await initializeDatabase();
//         console.log("Database initialized successfully.");
//         // Mark initialization as complete
//         setInitialized(true);
//       } catch (error) {
//         console.error("Error initializing database:", error);
//         setInitialized(false);
//       }
//     };

//     initialize();
//   }, []);

//   return initialized;
// }


import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { initializeDatabase } from "@/utils/initializeDatabase";
import NetInfo from "@react-native-community/netinfo";

export function useInitializeDatabase() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeDatabase();
        console.log("Database initialized successfully.");
        setInitialized(true);
      } catch (error) {
        console.error("Error initializing database:", error);
        setInitialized(false);
      }
    };

    // Initial load
    initialize();

    // Subscribe to AppState changes for re-fetching on resume
    const subscription = AppState.addEventListener("change", async (nextAppState) => {
      const state = await NetInfo.fetch();
      if (nextAppState === "active" && state.isConnected) {
        console.log("App resumed. Reinitializing database...");
        initialize();
      }
    });

    return () => subscription.remove();
  }, []);

  return initialized;
}
