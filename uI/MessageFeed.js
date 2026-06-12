import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import Message from './Message';

const INITIAL_SIZE = 10;
const PAGE_SIZE = 5;

export default function MessageFeed({ messages, onDelete, onEdit }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['messages', messages],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      pageParam === 0
        ? messages.slice(0, INITIAL_SIZE)
        : messages.slice(pageParam, pageParam + PAGE_SIZE),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.flat().length;
      return loaded < messages.length ? loaded : undefined;
    },
  });

  const allMessages = useMemo(() => data?.pages.flat() || [], [data]);

  return (
    <View style={styles.container}>
      <FlatList
        data={allMessages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feedContent}
        style={styles.feed}
        onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator color="blue" size="small" style={{ marginBottom: 10 }} />
          ) : null
        }
        renderItem={({ item }) => (
          <Message
            id={item.id}
            username={item.username}
            text={item.text}
            time={item.time}
            initials={item.initials}
            avatarColor={item.avatarColor}
            avatarText={item.avatarText}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        )}
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginBottom: 18,
  },
  feed: {
    width: '100%',
  },
  feedContent: {
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
