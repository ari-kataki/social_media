// imports
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Message from './Message';

export default function MessageFeed({
  messages,
  username,
  loading,
  onLoadMore,
  onDelete,
  onEdit,
}) {
  // scrollable feed
  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feedContent}
        style={styles.feed}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              color="#a855f7"
              size="small"
              style={{ marginBottom: 10 }}
            />
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
            canEdit={item.username === username}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        )}
      />
    </View>
  );
}

// styles
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
