// imports
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { useState } from 'react';

export default function Message({
  id,
  username,
  text,
  time,
  initials,
  avatarColor,
  avatarText,
  canEdit,
  onDelete,
  onEdit,
}) {
  // state: edit mode and the text being edited
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  // save the edited text and leave edit mode
  const handleSave = () => {
    onEdit(id, editedText);
    setIsEditing(false);
  };

  // ask for confirmation before deleting
  const handleDelete = () => {
    Alert.alert(
      'Delete message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(id) },
      ]
    );
  };

  // message card
  return (
    <View style={styles.card}>
      {/* avatar */}
      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
        <Text style={[styles.avatarText, { color: avatarText }]}>
          {initials}
        </Text>
      </View>

      <View style={styles.content}>
        {/* username and time */}
        <View style={styles.headerRow}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>

        {/* message text or edit input */}
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editedText}
            onChangeText={setEditedText}
            autoFocus
            multiline
          />
        ) : (
          <Text style={styles.text}>{text}</Text>
        )}

        {/* modify / save and delete buttons (only on my messages) */}
        {canEdit ? (
          <View style={styles.actionRow}>
            {isEditing ? (
              <Pressable
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save </Text>
              </Pressable>
            ) : (
              <Pressable
                style={[styles.button, styles.editButton]}
                onPress={() => {
                  setEditedText(text);
                  setIsEditing(true);
                }}
              >
                <Text style={styles.editButtonText}>Modify </Text>
              </Pressable>
            )}

            <Pressable
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>Delete </Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
}

// styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1326',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2d2342',
    padding: 14,
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f3e8ff',
  },
  time: {
    fontSize: 11,
    color: '#7c6f94',
  },
  text: {
    fontSize: 14,
    color: '#d1c4e9',
    lineHeight: 20,
    marginBottom: 8,
  },
  input: {
    fontSize: 14,
    color: '#f3e8ff',
    backgroundColor: '#0f0a1a',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#3b2a5c',
    marginBottom: 8,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#2a1a45',
    borderWidth: 1,
    borderColor: '#a855f7',
  },
  editButtonText: {
    color: '#d8b4fe',
    fontSize: 12,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#14301f',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  saveButtonText: {
    color: '#86efac',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#3a1520',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  deleteButtonText: {
    color: '#fca5a5',
    fontSize: 12,
    fontWeight: '600',
  },
});
