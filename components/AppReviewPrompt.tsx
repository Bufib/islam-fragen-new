// AppReviewPrompt.tsx
import React, { useEffect } from "react";
import { Platform, Linking } from "react-native";
import * as StoreReview from "expo-store-review";
import useAppReviewStore from "@/stores/useAppReviewStore";

const AppReviewPrompt: React.FC = () => {
  const {
    installDate,
    setInstallDate,
    hasRated,
    setHasRated,
    setRemindLaterDate,
    isEligibleForReview,
  } = useAppReviewStore();

  // On first app load, set the install date if it isn't set yet.
  useEffect(() => {
    if (!installDate) {
      setInstallDate(Date.now());
    }
  }, [installDate, setInstallDate]);

  // Check eligibility and trigger the native review prompt.
  useEffect(() => {
    const triggerReviewPrompt = async () => {
      if (isEligibleForReview()) {
        if (await StoreReview.isAvailableAsync()) {
          try {
            await StoreReview.requestReview();
            // Mark the user as having rated
            setHasRated(true);
          } catch (error) {
            console.error("Error requesting in-app review:", error);
          }
        } else {
          // Fallback: Open the store URL if the native prompt isn’t available.
          const storeURL =
            Platform.OS === "ios"
              ? "https://apps.apple.com/de/app/islam-fragen/id6737857116"
              : "https://play.google.com/store/apps/details?id=com.bufib.islamFragen&pcampaignid=web_share";
          await Linking.openURL(storeURL);
          setHasRated(true);
        }
      }
    };

    triggerReviewPrompt();
  }, [isEligibleForReview, setHasRated, setRemindLaterDate]);

  return null; // No UI is rendered; this component only handles the review prompt logic.
};

export default AppReviewPrompt;
