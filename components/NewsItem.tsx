import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { coustomTheme } from '@/components/coustomTheme';
import { NewsItemType } from '@/hooks/useFetchNews';

type NewsItemProps = {
  title: string;
  body_text: string;
  created_at: string;
};

export const NewsItem: React.FC<NewsItemProps> = ({ title, body_text, created_at }) => {
  const themeStyles = coustomTheme();
  const formattedDate = new Date(created_at).toISOString().split('T')[0];

  return (
    <ThemedView style={[styles.newsItem, themeStyles.contrast]}>
      <ThemedText style={styles.newsTitle} type="defaultSemiBold">
        {title}
      </ThemedText>
      <ThemedText style={styles.newsContent}>{body_text}</ThemedText>
      <ThemedText style={styles.newsDate}>{formattedDate}</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  newsItem: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  newsContent: {
    fontSize: 14,
    marginBottom: 5,
  },
  newsDate: {
    fontSize: 12,
    color: '#888',
  },
});