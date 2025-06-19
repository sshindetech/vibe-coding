import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import Head from 'expo-router/head';
import 'react-native-reanimated';
import "../global.css";

import Header from '@/components/Header';
import { useColorScheme } from '@/hooks/useColorScheme';
import { View } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
      <>
        <Head>
          <title>GenAI Data Analyst</title>
        </Head>
        <View>
          <Header />
          <View className='container mx-auto'>
            <Slot />
          </View>
        </View>
      </>
  );
}
