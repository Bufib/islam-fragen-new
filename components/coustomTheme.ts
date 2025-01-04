import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";

export const lightTheme = {
  defaultBackgorundColor: {
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.borderColor,
  },
  contrast: {
    backgroundColor: Colors.light.contrast,
    borderColor: Colors.light.borderColor,
  },

  text: {
    color: Colors.light.text,
  },
  searchResultCategory: {
    color: Colors.light.searchResultCategory,
  },

  activityIndicator: {
    color: Colors.light.activityIndicator,
  },
  newsMenuFixieren:{
    color: Colors.light.newsMenuFixieren,
  },
  newsMenuBearbeiten:{
    color: Colors.light.newsMenuBearbeiten,
  },
  newsMenuLoeschen:{
    color: Colors.light.newsMenuLoeschen,
  }
};

export const darkTheme = {
  defaultBackgorundColor: {
    backgroundColor: Colors.dark.background,
    borderColor: Colors.dark.borderColor,
  },
  contrast: {
    backgroundColor: Colors.dark.contrast,
    borderColor: Colors.dark.borderColor,
  },
  text: {
    color: Colors.dark.text,
  },
  searchResultCategory: {
    color: Colors.dark.searchResultCategory,
  },

  activityIndicator: {
    color: Colors.dark.activityIndicator,
  },
  newsMenuFixieren:{
    color: Colors.dark.newsMenuFixieren,
  },
  newsMenuBearbeiten:{
    color: Colors.dark.newsMenuBearbeiten,
  },
  newsMenuLoeschen:{
    color: Colors.dark.newsMenuLoeschen,
  }
};

export const coustomTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === "light" ? lightTheme : darkTheme;
};
