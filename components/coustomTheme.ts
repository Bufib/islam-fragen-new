import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";

export const lightTheme = {
  defaultBackgorundColor: {
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.borderColor,
  },
  renderItemsBackgroundcolor: {
    backgroundColor: Colors.light.contrast,
    borderColor: Colors.light.borderColor,
  },
  questionContainerBackground: {
    backgroundColor: Colors.light.contrast,
    borderColor: Colors.light.borderColor,
  },
  answerContainerBackground: {
    backgroundColor: Colors.light.contrast,
    borderColor: Colors.light.borderColor,
  }
};

export const darkTheme = {
  defaultBackgorundColor: {
    backgroundColor: Colors.dark.background,
    borderColor: Colors.dark.borderColor,
  },
  renderItemsBackgroundcolor: {
    backgroundColor: Colors.dark.contrast,
    borderColor: Colors.dark.borderColor,
  },
  questionContainerBackground: {
    backgroundColor: Colors.dark.contrast,
    borderColor: Colors.dark.borderColor,
  },
  answerContainerBackground: {
    backgroundColor: Colors.dark.contrast,
    borderColor: Colors.dark.borderColor,
  }
};

export const coustomTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === "light" ? lightTheme : darkTheme;
};
