import { Linking } from "react-native";

const handleOpenExternalUrl = async (url: string) => {
  try {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error("URL wird nicht unterstützt:", url);
    }
  } catch (error) {
    console.error("Fehler beim Öffnen der URL:", error);
  }
};

export default handleOpenExternalUrl;
