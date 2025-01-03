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
};

export const coustomTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === "light" ? lightTheme : darkTheme;
};
