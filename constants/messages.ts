import Toast from "react-native-toast-message";

// Internet
export const noInternetHeader = "Keine Internetverbindung";
export const noInternetBody =
  "Bitte stelle sicher, dass du mit dem Internet verbunden bist und versuch es später no einhmal ";

// SignUp
export const signUpErrorGeneral = "Fehler beim Registrieren!";

export const signUpSuccess = () => {
  return Toast.show({
    type: "success",
    text1: "Registrieren Erfolgreich!",
    text2: "Bitte überprüfe deine E-mail",
    topOffset: 60,
  });
};

export const signUpUserNameMin =
  "Benutzername muss mindestens 3 Zeichen lang sein";
export const signUpUserEmail = "Ungültige E-Mail-Adresse";
export const signUpUserPasswordMin =
  "Passwort muss mindestens 8 Zeichen lang sein";
export const signUpUserPasswordFormat =
  "Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten";
export const signUpUserPasswordConformation =
  "Passwörter stimmen nicht überein";
export const signUpUserNamesAlreadyInUsage =
  "Dieser Benutzername ist bereits vergeben!";

export const signUpUsernameNotEmpty = "Benutzername darf nicht leer sein.";
export const signUpEmailNotEmpty = "Email darf nicht leer sein.";
export const signUpPasswordNotEmpty = "Passwort darf nicht leer sein.";



// Login
export const loginError = "Fehler beim login";
export const loginSuccess = () => {
  return Toast.show({
    type: "success",
    text1: "Salam alaikum!",
    text1Style: { fontSize: 16, fontWeight: "600" },
    topOffset: 60,
  });
};

// Logout
export const logoutErrorGeneral = "Fehler beim ausloggen";
export const logoutSuccess = () => {
  return Toast.show({
    type: "success",
    text1: "Du wurdest erfolgreich ausgeloggt!",
    text1Style: { fontSize: 14, fontWeight: "600" },
    topOffset: 60,
  });
};

// Favorites
export const removeFavoriteToast = () => {
  return Toast.show({
    type: "error",
    text1: "Die Frage wurde aus deinen Favoriten entfernt!",
    text1Style: { fontWeight: "500" },
    topOffset: 60,
  });
};

export const addFavoriteToast = () => {
  return Toast.show({
    type: "success",
    text1: "Die Frage wurde deinen Favoriten hinzugefügt!",
    text1Style: { fontWeight: "500" },
    topOffset: 60,
  });
};
