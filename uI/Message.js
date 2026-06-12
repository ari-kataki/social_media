import { View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { useState } from 'react';

export default function Message({ id, username, text, time, initials, avatarColor, avatarText, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const handleSave = () => {
    onEdit(id, editedText);
    setIsEditing(false);
  };

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

  return (
    <View style={styles.card}>
      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
        <Text style={[styles.avatarText, { color: avatarText }]}>
          {initials}
        </Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        
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
        
        <View style={styles.actionRow}>
          {isEditing ? (
            <Pressable style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save </Text>
            </Pressable>
          ) : (
            <Pressable style={[styles.button, styles.editButton]} onPress={() => setIsEditing(true)}>
              <Text style={styles.editButtonText}>Modify </Text>
            </Pressable>
          )}
          
          <Pressable style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2, 
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
    color: '#1f2937',
  },
  time: {
    fontSize: 11,
    color: '#9ca3af',
  },
  text: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  input: {
    fontSize: 14,
    color: '#4b5563',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
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
    backgroundColor: '#f3e8ff',
    borderWidth: 1,
    borderColor: '#c084fc',
  },
  editButtonText: {
    color: '#6b21a8', 
    fontSize: 12,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#bbf7d0', 
    borderWidth: 1,
    borderColor: '#4ade80',
  },
  saveButtonText: {
    color: '#166534', 
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#fee2e2', 
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  deleteButtonText: {
    color: '#991b1b', 
    fontSize: 12,
    fontWeight: '600',
  },
});