// // import React, { useState } from "react";
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   StyleSheet,
// //   Alert,
// // } from "react-native";
// // import { z } from "zod";
// // import { supabase } from "@/utils/supabase";
// // import { router } from "expo-router";
// // // Password validation schema
// // const passwordSchema = z
// //   .string()
// //   .min(8, { message: "Das Passwort muss mindestens 8 Zeichen lang sein." })
// //   .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=\-]).{8,}$/, {
// //     message:
// //       "Das Passwort muss Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen enthalten.",
// //   });

// // // Form schema with password confirmation
// // const passwordFormSchema = z
// //   .object({
// //     password: passwordSchema,
// //     confirmPassword: z.string(),
// //   })
// //   .refine((data) => data.password === data.confirmPassword, {
// //     message: "Die Passwörter stimmen nicht überein",
// //     path: ["confirmPassword"],
// //   });

// // const changePassword = () => {
// //   const [password, setPassword] = useState("");
// //   const [confirmPassword, setConfirmPassword] = useState("");
// //   const [errors, setErrors] = useState({});
// //   const [loading, setLoading] = useState(false);

// //   const handlePasswordChange = async () => {
// //     try {
// //       setLoading(true);
// //       setErrors({});

// //       // Validate using Zod
// //       const validationResult = passwordFormSchema.safeParse({
// //         password,
// //         confirmPassword,
// //       });

// //       if (!validationResult.success) {
// //         const formattedErrors = {};
// //         validationResult.error.errors.forEach((error) => {
// //           formattedErrors[error.path[0]] = error.message;
// //         });
// //         setErrors(formattedErrors);
// //         return;
// //       }

// //       // Update password in Supabase
// //       const { error } = await supabase.auth.updateUser({
// //         password: password,
// //       });

// //       if (error) throw error;

// //       Alert.alert("Erfolg", "Passwort erfolgreich aktualisiert");
// //       setPassword("");
// //       setConfirmPassword("");
// //       router.push("/(tabs)/settings/");
// //     } catch (error) {
// //       Alert.alert("Fehler", error.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const renderError = (key) => {
// //     return errors[key] ? (
// //       <Text style={styles.errorText}>{errors[key]}</Text>
// //     ) : null;
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Passwort ändern</Text>

// //       <View style={styles.inputContainer}>
// //         <Text style={styles.label}>Neues Passwort</Text>
// //         <TextInput
// //           style={styles.input}
// //           value={password}
// //           onChangeText={setPassword}
// //           secureTextEntry
// //           placeholder="Neues Passwort eingeben"
// //           placeholderTextColor="#666"
// //         />
// //         {renderError("password")}
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text style={styles.label}>Passwort bestätigen</Text>
// //         <TextInput
// //           style={styles.input}
// //           value={confirmPassword}
// //           onChangeText={setConfirmPassword}
// //           secureTextEntry
// //           placeholder="Passwort bestätigen"
// //           placeholderTextColor="#666"
// //         />
// //         {renderError("confirmPassword")}
// //       </View>

// //       <TouchableOpacity
// //         style={[styles.button, loading && styles.buttonDisabled]}
// //         onPress={handlePasswordChange}
// //         disabled={loading}
// //       >
// //         <Text style={styles.buttonText}>
// //           {loading ? "Wird aktualisiert..." : "Passwort aktualisieren"}
// //         </Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: "#fff",
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: "bold",
// //     marginBottom: 30,
// //     color: "#1a1a1a",
// //   },
// //   inputContainer: {
// //     marginBottom: 20,
// //   },
// //   label: {
// //     fontSize: 16,
// //     marginBottom: 8,
// //     color: "#333",
// //     fontWeight: "500",
// //   },
// //   input: {
// //     backgroundColor: "#f5f5f5",
// //     borderRadius: 8,
// //     padding: 15,
// //     fontSize: 16,
// //     color: "#1a1a1a",
// //     borderWidth: 1,
// //     borderColor: "#e0e0e0",
// //   },
// //   errorText: {
// //     color: "#dc3545",
// //     fontSize: 14,
// //     marginTop: 5,
// //   },
// //   button: {
// //     backgroundColor: "#007AFF",
// //     borderRadius: 8,
// //     padding: 15,
// //     alignItems: "center",
// //     marginTop: 20,
// //   },
// //   buttonDisabled: {
// //     backgroundColor: "#99c4ff",
// //   },
// //   buttonText: {
// //     color: "#fff",
// //     fontSize: 16,
// //     fontWeight: "600",
// //   },
// // });

// // export default changePassword;

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Pressable,
//   useColorScheme,
// } from "react-native";
// import { z } from "zod";
// import { supabase } from "@/utils/supabase";
// import { router } from "expo-router";
// import Feather from "@expo/vector-icons/Feather";

// // Password validation schema
// const passwordSchema = z
//   .string()
//   .min(8, { message: "Das Passwort muss mindestens 8 Zeichen lang sein." })
//   .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=\-]).{8,}$/, {
//     message:
//       "Das Passwort muss Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen enthalten.",
//   });

// // Form schema with password confirmation
// const passwordFormSchema = z
//   .object({
//     password: passwordSchema,
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Die Passwörter stimmen nicht überein",
//     path: ["confirmPassword"],
//   });

// type PasswordFormData = z.infer<typeof passwordFormSchema>;
// type FormErrors = {
//   [K in keyof PasswordFormData]?: string;
// };

// const ChangePassword = () => {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const colorScheme = useColorScheme();

//   const handlePasswordChange = async () => {
//     try {
//       setLoading(true);
//       setErrors({});

//       // Validate using Zod
//       const validationResult = passwordFormSchema.safeParse({
//         password,
//         confirmPassword,
//       });

//       if (!validationResult.success) {
//         const formattedErrors: FormErrors = {};
//         validationResult.error.errors.forEach((error) => {
//           if (error.path[0]) {
//             formattedErrors[error.path[0] as keyof PasswordFormData] = error.message;
//           }
//         });
//         setErrors(formattedErrors);
//         return;
//       }

//       // Update password in Supabase
//       const { error } = await supabase.auth.updateUser({
//         password: password,
//       });

//       if (error) throw error;

//       Alert.alert("Erfolg", "Passwort erfolgreich aktualisiert");
//       setPassword("");
//       setConfirmPassword("");
//       router.push("/(tabs)/settings/");
//     } catch (error: any) {
//       Alert.alert("Fehler", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderError = (key: keyof FormErrors) => {
//     return errors[key] ? (
//       <Text style={styles.errorText}>{errors[key]}</Text>
//     ) : null;
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Passwort ändern</Text>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Neues Passwort</Text>
//         <View style={styles.passwordContainer}>
//           <TextInput
//             style={styles.passwordInput}
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry={!showPassword}
//             placeholder="Neues Passwort eingeben"
//             placeholderTextColor="#666"
//           />
//           <Pressable
//             onPress={() => setShowPassword(!showPassword)}
//             style={styles.eyeIcon}
//           >
//             {showPassword ? (
//               <Feather
//                 name="eye"
//                 size={24}
//                 color={colorScheme === "dark" ? "white" : "black"}
//               />
//             ) : (
//               <Feather
//                 name="eye-off"
//                 size={24}
//                 color={colorScheme === "dark" ? "white" : "black"}
//               />
//             )}
//           </Pressable>
//         </View>
//         {renderError("password")}
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Passwort bestätigen</Text>
//         <View style={styles.passwordContainer}>
//           <TextInput
//             style={styles.passwordInput}
//             value={confirmPassword}
//             onChangeText={setConfirmPassword}
//             secureTextEntry={!showConfirmPassword}
//             placeholder="Passwort bestätigen"
//             placeholderTextColor="#666"
//           />
//           <Pressable
//             onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//             style={styles.eyeIcon}
//           >
//             {showConfirmPassword ? (
//               <Feather
//                 name="eye"
//                 size={24}
//                 color={colorScheme === "dark" ? "white" : "black"}
//               />
//             ) : (
//               <Feather
//                 name="eye-off"
//                 size={24}
//                 color={colorScheme === "dark" ? "white" : "black"}
//               />
//             )}
//           </Pressable>
//         </View>
//         {renderError("confirmPassword")}
//       </View>

//       <TouchableOpacity
//         style={[styles.button, loading && styles.buttonDisabled]}
//         onPress={handlePasswordChange}
//         disabled={loading}
//       >
//         <Text style={styles.buttonText}>
//           {loading ? "Wird aktualisiert..." : "Passwort aktualisieren"}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 30,
//     color: "#1a1a1a",
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: "#333",
//     fontWeight: "500",
//   },
//   passwordContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//   },
//   passwordInput: {
//     flex: 1,
//     padding: 15,
//     fontSize: 16,
//     color: "#1a1a1a",
//   },
//   eyeIcon: {
//     padding: 10,
//   },
//   errorText: {
//     color: "#dc3545",
//     fontSize: 14,
//     marginTop: 5,
//   },
//   button: {
//     backgroundColor: "#007AFF",
//     borderRadius: 8,
//     padding: 15,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   buttonDisabled: {
//     backgroundColor: "#99c4ff",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

// export default ChangePassword;


import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Pressable,
  useColorScheme,
} from "react-native";
import { z } from "zod";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import ConfirmHcaptcha from "@hcaptcha/react-native-hcaptcha";

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, { message: "Das Passwort muss mindestens 8 Zeichen lang sein." })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=\-]).{8,}$/, {
    message:
      "Das Passwort muss Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen enthalten.",
  });

// Form schema with password confirmation
const passwordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Die Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordFormSchema>;
type FormErrors = {
  [K in keyof PasswordFormData]?: string;
};

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const captchaRef = useRef(null);
  const colorScheme = useColorScheme();

  const handlePasswordChangeWithCaptcha = async (captchaToken: string) => {
    try {
      setLoading(true);
      setErrors({});

      // Validate using Zod
      const validationResult = passwordFormSchema.safeParse({
        password,
        confirmPassword,
      });

      if (!validationResult.success) {
        const formattedErrors: FormErrors = {};
        validationResult.error.errors.forEach((error) => {
          if (error.path[0]) {
            formattedErrors[error.path[0] as keyof PasswordFormData] = error.message;
          }
        });
        setErrors(formattedErrors);
        return;
      }

      // Update password in Supabase with captcha token
      const { error } = await supabase.auth.updateUser({
        password: password,
        options: { captchaToken }
      });

      if (error) throw error;

      Alert.alert("Erfolg", "Passwort erfolgreich aktualisiert");
      setPassword("");
      setConfirmPassword("");
      router.push("/(tabs)/settings/");
    } catch (error: any) {
      Alert.alert("Fehler", error.message);
    } finally {
      setLoading(false);
      setShowCaptcha(false);
    }
  };

  const onMessage = async (event: any) => {
    if (event && event.nativeEvent.data) {
      const token = event.nativeEvent.data;

      if (["error", "expired"].includes(token)) {
        if (!showCaptcha) {
          console.log("Captcha not active.");
          return;
        }
        setShowCaptcha(false);
        Alert.alert(
          "Fehler",
          "Captcha-Überprüfung fehlgeschlagen. Bitte versuche es erneut."
        );
      } else if (token === "cancel") {
        setShowCaptcha(false);
        Alert.alert(
          "Fehler",
          "Bitte nicht wegklicken, da die Überprüfung sonst abgebrochen wird!"
        );
      } else if (token === "open") {
        // Captcha opened
      } else {
        await handlePasswordChangeWithCaptcha(token);
      }
    }
  };

  const handlePasswordChange = async () => {
    // Initial validation before showing captcha
    const validationResult = passwordFormSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!validationResult.success) {
      const formattedErrors: FormErrors = {};
      validationResult.error.errors.forEach((error) => {
        if (error.path[0]) {
          formattedErrors[error.path[0] as keyof PasswordFormData] = error.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    setShowCaptcha(true);
  };

  useEffect(() => {
    if (showCaptcha && captchaRef.current) {
      try {
        captchaRef.current?.show();
      } catch (error) {
        console.error("Captcha konnte nicht geöffnet werden:", error);
        setShowCaptcha(false);
      }
    }
  }, [showCaptcha]);

  const renderError = (key: keyof FormErrors) => {
    return errors[key] ? (
      <Text style={styles.errorText}>{errors[key]}</Text>
    ) : null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passwort ändern</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Neues Passwort</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder="Neues Passwort eingeben"
            placeholderTextColor="#666"
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            {showPassword ? (
              <Feather
                name="eye"
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            ) : (
              <Feather
                name="eye-off"
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            )}
          </Pressable>
        </View>
        {renderError("password")}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Passwort bestätigen</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            placeholder="Passwort bestätigen"
            placeholderTextColor="#666"
          />
          <Pressable
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIcon}
          >
            {showConfirmPassword ? (
              <Feather
                name="eye"
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            ) : (
              <Feather
                name="eye-off"
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            )}
          </Pressable>
        </View>
        {renderError("confirmPassword")}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handlePasswordChange}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Wird aktualisiert..." : "Passwort aktualisieren"}
        </Text>
      </TouchableOpacity>

      {showCaptcha && (
        <ConfirmHcaptcha
          ref={captchaRef}
          siteKey="c2a47a96-0c8e-48b8-a6c6-e60a2e9e4228"
          baseUrl="https://hcaptcha.com"
          onMessage={onMessage}
          languageCode="de"
          size="invisible"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#1a1a1a",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
    fontWeight: "500",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: "#1a1a1a",
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: "#dc3545",
    fontSize: 14,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#99c4ff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ChangePassword;