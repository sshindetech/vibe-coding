import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

interface ChatMessageProps {
  text: string;
  type: 'user' | 'bot';
  children?: React.ReactNode;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ text, type, children }) => {
  // Copy to clipboard handler
  const handleCopy = async () => {
    await Clipboard.setStringAsync(text);
  };

  return (
    <View className={`w-full flex ${type === 'user' ? 'items-end' : 'items-start'} mb-2`}>
      <View
        className={`rounded-2xl px-4 py-2 max-w-[80%] ${type === 'user' ? 'bg-primary self-end' : 'bg-gray-100 self-start'} ${type === 'user' ? 'mr-2' : 'ml-2'}`}
        style={{ marginBottom: 2, backgroundColor: type === 'user' ? 'var(--color-primary)' : 'var(--color-surface)' }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: type === 'user' ? '#fff' : 'var(--color-text)', flex: 1 }}>{text}</Text>
          <TouchableOpacity onPress={handleCopy} className="ml-2" >
            <MaterialIcons name="content-copy" size={16} color={type === 'user' ? '#fff' : 'var(--color-text)'} />
          </TouchableOpacity>
        </View>
      </View>
      {children}
    </View>
  );
};
