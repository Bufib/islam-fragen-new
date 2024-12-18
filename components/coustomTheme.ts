import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";

export const lightTheme = {
  containerDefault: {
    backgroundColor: Colors.light.background,
  },
  containerContrast: {
    backgroundColor: Colors.light.contrast,
  },

  error: {
    color: Colors.light.error,
  },
  addNewsButton: {
    color: Colors.light.addNewsButton,
  },

  categorieText: {
    color: Colors.light.categorieText,
  },
  categorieBackground: {
    backgroundColor: Colors.light.categorieBackground,
  },
  indexBorderDash: {
    borderColor: Colors.light.indexBorderDash,
    color: Colors.light.indexBorderDash,
  },
  indexCategoryTextBorder: {
    borderColor: Colors.light.indexCategoryTextBorder,
  },
  backgroundIndexHeader: {
    backgroundColor: Colors.light.backgroundIndexHeader,
  },
  link: {
    color: Colors.light.link,
  },
  shadow: {
    shadowColor: Colors.light.shadowColor,
  },

  trashIcon: {
    color: Colors.light.trashIcon,
  },
  characterCountNewsImage: {
    color: Colors.light.characterCountNewsImage,
  },

  arrowUp: {
    color: Colors.light.arrowUp,
  },
  searchBorderDash: {
    color: Colors.light.searchBorderDash,
  },
  deleteIcon: {
    color: Colors.light.deleteIcon,
  },
  downloadIcon: {
    color: Colors.light.deleteIcon,
  },
  favoriteIcon: {
    color: Colors.light.favoriteIcon,
  },
  markdownText: {
    color: Colors.light.text,
  },
  fontSizeIcon: {
    color: Colors.light.fontSizeIcon,
  },
  modalQuestion: {
    backgroundColor: Colors.light.modalQuestion,
  },
  modalQuestionBlurredBackground: {
    backgroundColor: Colors.light.modalQuestionBlurredBackground,
  },
  inverseText: {
    color: Colors.light.inverseText,
  },
  modalQuestionText: {
    color: Colors.light.modalQuestionText,
  },
  inverseQuestionText: {
    color: Colors.light.inverseQuestionText,
  },
  inverseQuestionBackground: {
    backgroundColor: Colors.light.contrast,
  },
  inverseTextIndex: {
    color: Colors.light.inverseTextIndex,
  },
  inverseTextInput: {
    color: Colors.light.black,
    backgroundColor: Colors.light.contrast,
  },
  pickerContainerBorder: {
    borderColor: Colors.light.pickerContainerBorder,
  },
};

export const darkTheme = {
  containerDefault: {
    backgroundColor: Colors.dark.background,
  },
  containerContrast: {
    backgroundColor: Colors.dark.contrast,
  },
  text: {
    color: Colors.dark.text,
  },
  error: {
    color: Colors.dark.error,
  },
  addNewsButton: {
    color: Colors.dark.addNewsButton,
  },

  background: {
    backgroundColor: Colors.dark.background,
  },
  inverseTextInput: {
    color: Colors.light.white,
    backgroundColor: Colors.dark.contrast,
  },
  categorieText: {
    color: Colors.dark.categorieText,
  },
  categorieBackground: {
    backgroundColor: Colors.dark.categorieBackground,
  },
  indexCategoryTextBorder: {
    borderColor: Colors.dark.indexCategoryTextBorder,
  },
  indexBorderDash: {
    borderColor: Colors.dark.indexBorderDash,
    color: Colors.dark.indexBorderDash,
  },
  backgroundIndexHeader: {
    backgroundColor: Colors.dark.backgroundIndexHeader,
  },
  shadow: {
    shadowColor: Colors.dark.shadowColor,
  },
  link: {
    color: Colors.dark.link,
  },

  trashIcon: {
    color: Colors.dark.trashIcon,
  },
  characterCountNewsImage: {
    color: Colors.dark.characterCountNewsImage,
  },
  arrowUp: {
    color: Colors.dark.arrowUp,
  },
  searchBorderDash: {
    color: Colors.dark.searchBorderDash,
  },
  deleteIcon: {
    color: Colors.dark.deleteIcon,
  },
  downloadIcon: {
    color: Colors.dark.deleteIcon,
  },
  favoriteIcon: {
    color: Colors.dark.favoriteIcon,
  },
  markdownText: {
    color: Colors.dark.text,
  },
  fontSizeIcon: {
    color: Colors.dark.fontSizeIcon,
  },
  modalQuestion: {
    backgroundColor: Colors.dark.modalQuestion,
  },
  modalQuestionBlurredBackground: {
    backgroundColor: Colors.dark.modalQuestionBlurredBackground,
  },
  inverseText: {
    color: Colors.dark.inverseText,
  },
  modalQuestionText: {
    color: Colors.dark.modalQuestionText,
  },
  inverseQuestionText: {
    color: Colors.dark.inverseQuestionText,
  },
  inverseQuestionBackground: {
    backgroundColor: Colors.dark.contrast,
  },
  inverseTextIndex: {
    color: Colors.dark.inverseTextIndex,
  },
  pickerContainerBorder: {
    borderColor: Colors.dark.pickerContainerBorder,
  },
};

export const coustomTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === "light" ? lightTheme : darkTheme;
};
