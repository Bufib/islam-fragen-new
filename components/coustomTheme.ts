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

  searchBarText: {
    color: Colors.light.text,
  },
  searchResultCategory: {
    color: Colors.light.searchResultCategory,
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
  searchBarText: {
    color: Colors.dark.text,
  },
  searchResultCategory: {
    color: Colors.dark.searchResultCategory,
  },
};

export const coustomTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === "light" ? lightTheme : darkTheme;
};
