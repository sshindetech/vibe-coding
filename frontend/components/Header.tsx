import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import '../global-themes.css';

const themes = [
  { key: '', label: 'Default' },
  { key: 'theme-dark', label: 'Dark' },
  { key: 'theme-green', label: 'Green' },
];

export default function Header() {
  const [theme, setTheme] = useState('');

  useEffect(() => {
    document.body.classList.remove('theme-dark', 'theme-green');
    if (theme) document.body.classList.add(theme);
    else document.body.classList.remove('theme-dark', 'theme-green');
  }, [theme]);

  return (
    <View className="w-full bg-primary py-4 px-6 shadow-md flex-row items-center justify-between gap-4">
      <View className="flex-row items-center gap-4">
        <Image
          source={require('../assets/images/react-logo.png')}
          style={{ width: 40, height: 40, resizeMode: 'contain' }}
          accessibilityLabel="Logo"
        />
        <Text className="text-2xl font-bold text-white tracking-wide">Data Analyst <Text className='text-xs'>(Generated using Vibe Coding)</Text> </Text>
      </View>
      <View className="flex-row items-center space-x-2">
        <Text className="text-xs text-white">Theme:</Text>
        {themes.map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setTheme(t.key)}
            className={`px-2 py-1 rounded ${theme === t.key ? 'bg-white' : 'bg-primary border border-white'}`}
          >
            <Text className={theme === t.key ? 'text-primary' : 'text-white'}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
