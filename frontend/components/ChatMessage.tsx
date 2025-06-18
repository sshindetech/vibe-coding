import React from 'react';
import { View, Text } from 'react-native';

interface ChatMessageProps {
  text: string;
  type: 'user' | 'bot';
  children?: React.ReactNode;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ text, type, children }) => (
  <View className={`w-full flex ${type === 'user' ? 'items-end' : 'items-start'} mb-2`}>
    <View
      className={`rounded-2xl px-4 py-2 max-w-[80%] ${type === 'user' ? 'bg-primary self-end' : 'bg-gray-100 self-start'} ${type === 'user' ? 'mr-2' : 'ml-2'}`}
      style={{ marginBottom: 2, backgroundColor: type === 'user' ? 'var(--color-primary)' : 'var(--color-surface)' }}
    >
      <Text style={{ color: type === 'user' ? '#fff' : 'var(--color-text)' }}>{text}</Text>
    </View>
    {children}
  </View>
);
