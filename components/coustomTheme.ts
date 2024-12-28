import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";

export const lightTheme = {
  defaultBackgorundColor: {
    backgroundColor: Colors.light.background,
  },
  renderItemsBackgroundcolor: {
    backgroundColor: Colors.light.contrast,
  }
};

export const darkTheme = {
  defaultBackgorundColor: {
    backgroundColor: Colors.dark.background,
  },
  renderItemsBackgroundcolor: {
    backgroundColor: Colors.dark.contrast,
  }
};

export const coustomTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === "light" ? lightTheme : darkTheme;
};
