import React, { useState, useRef } from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { coustomTheme } from "@/components/coustomTheme";
import { NewsItemType } from "@/hooks/useFetchNews";
import { Colors } from "@/constants/Colors";
import { formateDate } from "./formateDate";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import RenderLinkNewsItem from "@/components/RenderLinkNewsItem";
import { useAuthStore } from "./authStore";
import Entypo from "@expo/vector-icons/Entypo";
import NewsMenu from "./NewsMenu";
export const NewsItem = ({
  id,
  title,
  body_text,
  created_at,
  image_url,
  internal_url,
  external_url,
}: NewsItemType) => {
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();
  const isAdmin = useAuthStore((state) => state.isAdmin);

  return (
    <View style={[styles.newsItem, themeStyles.contrast]}>
      {isAdmin && (
        <ThemedView style={styles.newsMenu}>
          <NewsMenu id={id}/>
        </ThemedView>
      )}
      {title && title.trim() !== "" && (
        <ThemedText style={styles.newsTitle} type="defaultSemiBold">
          {title}
        </ThemedText>
      )}
      {body_text && body_text.trim() !== "" && (
        <ThemedText style={styles.newsContent}>{body_text}</ThemedText>
      )}

      {external_url && external_url.length > 0 && (
        <ThemedView style={styles.linksContainer}>
          {external_url.map((url, index) => (
            <RenderLinkNewsItem
              key={index}
              url={url}
              index={index}
              isExternal={true}
            />
          ))}
        </ThemedView>
      )}

      {internal_url && internal_url.length > 0 && (
        <ThemedView style={styles.linksContainer}>
          {internal_url.map((url, index) => (
            <RenderLinkNewsItem
              key={index}
              url={url}
              index={index}
              isExternal={false}
            />
          ))}
        </ThemedView>
      )}
      <ThemedText style={styles.newsDate}>{formateDate(created_at)}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  newsItem: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    gap: 10,
  },
  newsMenu: {
    backgroundColor: "transparent",
    flex: 1,
    alignSelf: "flex-end",
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  newsContent: {
    fontSize: 18,
  },
  newsDate: {
    fontSize: 14,
    color: Colors.universal.created_atTextColor,
  },
  linksContainer: {
    backgroundColor: "transparent",
  },
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
