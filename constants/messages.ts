import Toast from "react-native-toast-message";

export const removeFavoriteToast = () => {
  return Toast.show({
    type: "error",
    text1: "Die Frage wurde aus deinen Favoriten entfernt!",
    text1Style: { fontWeight: "500" },
    topOffset: 60
  });
};

export const addFavoriteToast = () => {
    return Toast.show({
      type: "success",
      text1: "Die Frage wurde deinen Favoriten hinzugefügt!",
      text1Style: { fontWeight: "500" },
      topOffset: 60
    });
  };
  