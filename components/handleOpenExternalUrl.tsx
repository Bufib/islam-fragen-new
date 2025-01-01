import * as WebBrowser from "expo-web-browser";

const handleOpenExternalUrl = async (url: string) => {
  try {
    await WebBrowser.openBrowserAsync(url);
  } catch (error) {
    console.error("Error opening URL:", error);
  }
};

export default handleOpenExternalUrl;
