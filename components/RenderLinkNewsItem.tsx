import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import handleOpenExternalUrl from "./handleOpenExternalUrl";
import handleOpenInternallUrl from "./handleOpenInternalUrl";

type RenderLinkNewsItemProps = {
  url: string;
  index: number;
  isExternal: boolean;
};

const RenderLinkNewsItem = ({
  url,
  index,
  isExternal,
}: RenderLinkNewsItemProps) => {
  const colorScheme = useColorScheme(); // Now this hook is inside a component

  return (
    <Pressable
      key={index}
      style={({ pressed }) => [
        styles.linkButton,
        pressed && styles.linkButtonPressed,
      ]}
      onPress={() =>
        isExternal ? handleOpenExternalUrl(url) : handleOpenInternallUrl(url)
      }
    >
      <Feather
        name={isExternal ? "external-link" : "link"}
        size={14}
        color={colorScheme === "dark" ? "white" : "black"}
        style={{ paddingRight: 5 }}
      />
      <ThemedText style={styles.linkText} numberOfLines={1}>
        {url}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
  },
  linkButtonPressed: {
    opacity: 0.7,
  },
  linkText: {
    fontSize: 14,
    color: Colors.universal.link,
    flex: 1,
  },
});

export default RenderLinkNewsItem;
