import React, { useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { coustomTheme } from "@/components/coustomTheme";
import { NewsItemType } from "@/hooks/useFetchNews";
import { Colors } from "@/constants/Colors";
import { formateDate } from "./formateDate";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import RenderLinkNewsItem from "@/components/RenderLinkNewsItem";
import { useAuthStore } from "./authStore";
import AntDesign from "@expo/vector-icons/AntDesign";
import NewsMenu from "./NewsMenu";
import { Image } from "expo-image";
import PagerView from 'react-native-pager-view';

const screenWidth = Dimensions.get("window").width;
const imageHeight = screenWidth * 1.2;

export const NewsItem = ({
  id,
  title,
  body_text,
  created_at,
  image_url,
  internal_url,
  external_url,
  is_pinned,
}: NewsItemType) => {
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <View style={[styles.newsItem, themeStyles.contrast]}>
      {is_pinned && (
        <AntDesign
          name="pushpin"
          size={24}
          color={colorScheme === "dark" ? "white" : "black"}
          style={styles.pinIconStyle}
        />
      )}

      {isAdmin && (
        <ThemedView style={styles.newsMenu}>
          <NewsMenu id={id} is_pinned={is_pinned || false} />
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
              key={`${external_url}-${index}`}
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
              key={`${internal_url}-${index}`}
              url={url}
              index={index}
              isExternal={false}
            />
          ))}
        </ThemedView>
      )}
      {image_url && image_url.length > 0 && (
        <View>
          <PagerView
            style={{ height: imageHeight }}
            initialPage={0}
            scrollEnabled={true} // Allow horizontal scrolling only within the PagerView
            onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
          >
            {image_url.map((url, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image
                  source={{ uri: url }}
                  style={styles.image}
                  contentFit="cover"
                />
              </View>
            ))}
          </PagerView>
          {/* Dots Pagination */}
          <View style={styles.dotsContainer}>
            {image_url.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentPage === index ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        </View>
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
  pinIconStyle: {
    flex: 1,
    alignSelf: "flex-end",
    transform: [{ rotateY: "180deg" }],
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

  linksContainer: {
    backgroundColor: "transparent",
  },
  image: {
    width: screenWidth,
    height: imageHeight,
    borderRadius: 10,
  },
  imageContainer: {
    width: screenWidth,
    height: imageHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "black",
  },
  inactiveDot: {
    backgroundColor: "gray",
  },
  newsDate: {
    fontSize: 14,
    color: Colors.universal.created_atTextColor,
  },
});
