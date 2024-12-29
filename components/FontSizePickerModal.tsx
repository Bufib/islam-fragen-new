import React, { useEffect } from "react";
import { Modal, StyleSheet, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { coustomTheme } from "./coustomTheme";
import { useFontSizeStore } from "@/stores/fontSizeStore";

interface FontSizePickerModalProps {
  visible: boolean;
  onClose: () => void;
}

const fontSizeOptions = [
  { label: "Klein", fontSize: 16, lineHeight: 30 },
  { label: "Mittel", fontSize: 20, lineHeight: 40 },
  { label: "Groß", fontSize: 25, lineHeight: 50 },
];

const FontSizePickerModal: React.FC<FontSizePickerModalProps> = ({
  visible,
  onClose,
}) => {
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();

  const { fontSize, lineHeight, setFontSize, setLineHeight } =
    useFontSizeStore(); // Use Zustand store for font size

  const [pickerValue, setPickerValue] = React.useState(
    fontSizeOptions.find((option) => option.fontSize === fontSize)?.label ||
      "Mittel"
  );

  useEffect(() => {
    if (visible) {
      // Sync picker value with Zustand state
      const selectedOption = fontSizeOptions.find(
        (option) => option.fontSize === fontSize
      );
      setPickerValue(selectedOption?.label || "Mittel");
    }
  }, [visible, fontSize]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Modal Background */}
      <Pressable style={styles.modalContainer} onPress={onClose}>
        {/* Modal Content */}
        <Pressable style={styles.pickerContainer} onPress={() => {}}>
          <Picker
            selectedValue={pickerValue}
            onValueChange={(itemValue) => {
              setPickerValue(itemValue);

              const selectedOption = fontSizeOptions.find(
                (option) => option.label === itemValue
              );

              if (selectedOption) {
                setFontSize(selectedOption.fontSize);
                setLineHeight(selectedOption.lineHeight);
              }

              // Dismiss the picker modal
              onClose();
            }}
          >
            {fontSizeOptions.map((option) => (
              <Picker.Item
                key={option.label}
                label={option.label}
                value={option.label}
                color={
                  colorScheme === "light"
                    ? Colors.light.modalQuestionText
                    : Colors.dark.modalQuestionText
                }
              />
            ))}
          </Picker>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.universal.modalQuestionBlurredBackground,
  },
  pickerContainer: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
});

export default FontSizePickerModal;
