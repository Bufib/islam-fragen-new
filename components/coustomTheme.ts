import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";

export const lightTheme = {
  defaultBackgorundColor: {
    backgroundColor: Colors.light.background,
  },
  renderItemsBackgroundcolor: {
    backgroundColor: Colors.universal.white,
  }
};

export const darkTheme = {
  defaultBackgorundColor: {
    backgroundColor: Colors.light.background,
  },
  renderItemsBackgroundcolor: {
    backgroundColor: Colors.universal.black,
  }
};

export const coustomTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === "light" ? lightTheme : darkTheme;
};
