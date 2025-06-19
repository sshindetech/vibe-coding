import { MaterialIcons } from '@expo/vector-icons';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Tooltip as ChartTooltip,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
} from 'chart.js';
import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ChartBlock } from '../components/ChartBlock';
import { ChatMessage } from '../components/ChatMessage';
import '../global-themes.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

interface Message {
  type: 'user' | 'bot';
  text: string;
  chartData?: any;
}

const sampleMessages = [
  'Show me a summary of the data',
  'What are the top 5 categories?',
  'Plot a trend of sales over time',
  'Show the breakdown of unique products sold by month',
  'Give me a breakdown by country',
];

export default function MainScreen() {
  const graphHeight = 100; // Default height for charts
  const [file, setFile] = useState<any>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'doughnut'>('bar');
  const [showSamples, setShowSamples] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      // @ts-ignore
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, loading]);

  const handleFilePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const pickedFile = result.assets[0].file;
      setFile(pickedFile);
      setUploadedFiles((prev) => [...prev, pickedFile]);
      // Upload file to backend /upload endpoint
      const formData = new FormData();
      if (pickedFile) {
        formData.append('file', pickedFile);
      }
      setLoading(true);
      try {
        await fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: formData,
        });
        setMessages((prev) => [
          ...prev,
          { type: 'bot', text: 'File upload complete. You can now enter your query.' },
        ]);
      } catch (e) {
        setMessages((prev) => [
          ...prev,
          { type: 'bot', text: 'Error uploading file.' },
        ]);
      }
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { type: 'user', text: input }]);
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
        body: JSON.stringify({ query: input }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: data.summary, chartData: data.chartData },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: 'Error processing your request.' },
      ]);
    }
    setInput('');
    setLoading(false);
  };

  // Helper to get current theme colors from CSS variables
  function getThemeColors() {
    if (typeof window === 'undefined') return {
      primary: '#0a6ad2',
      secondary: '#34A853',
      accent: '#FBBC05',
      danger: '#EA4335',
    };
    const styles = getComputedStyle(document.body);
    return {
      primary: styles.getPropertyValue('--color-primary').trim() || '#0a6ad2',
      secondary: styles.getPropertyValue('--color-secondary').trim() || '#34A853',
      accent: styles.getPropertyValue('--color-accent').trim() || '#FBBC05',
      danger: styles.getPropertyValue('--color-danger').trim() || '#EA4335',
    };
  }

  return (
    <View className="w-full mt-2 min-h-[700px] rounded-md mx-auto bg-background border border-gray-200 overflow-hidden flex-1 flex-row">
      {/* Left panel for uploaded files, styled like chat header */}
      <View className="w-64 min-w-[180px] max-w-[300px] bg-secondary border-r border-gray-200 flex-col">
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
          <Text className="text-lg font-bold text-white">Uploaded Files</Text>
        </View>
        <View className="p-4">
          {uploadedFiles.length === 0 && <Text className="text-gray-200">No files uploaded yet.</Text>}
          {uploadedFiles.map((f, idx) => (
            <View key={idx} className="flex-row items-center mb-2">
              <MaterialIcons name="attach-file" size={18} color="#fff" />
              <Text className="ml-2 text-sm text-white truncate max-w-[180px]">{f.name || f.uri || 'File'}</Text>
            </View>
          ))}
        </View>
      </View>
      {/* Main chat area */}
      <View className="flex-1 flex flex-col">
        <View className="flex px-4 py-3 bg-secondary border-b border-gray-100">
          <View className='flex-row items-center justify-between'>
            <Text className="text-lg font-bold text-white">Chat Assistant</Text>
          
          {/* Chart type selector */}
          <View className="flex-row items-center space-x-2">
            <Text className="text-sm font-semibold text-white mr-2">Chart Type:</Text>
            <TouchableOpacity onPress={() => setChartType('line')} className={`px-3 py-1 rounded ${chartType === 'line' ? 'bg-primary' : 'bg-gray-200'}`}><Text className={chartType === 'line' ? 'text-white' : 'text-gray-700'}>Line</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setChartType('bar')} className={`px-3 py-1 rounded ${chartType === 'bar' ? 'bg-primary' : 'bg-gray-200'}`}><Text className={chartType === 'bar' ? 'text-white' : 'text-gray-700'}>Bar</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setChartType('pie')} className={`px-3 py-1 rounded ${chartType === 'pie' ? 'bg-primary' : 'bg-gray-200'}`}><Text className={chartType === 'pie' ? 'text-white' : 'text-gray-700'}>Pie</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setChartType('doughnut')} className={`px-3 py-1 rounded ${chartType === 'doughnut' ? 'bg-primary' : 'bg-gray-200'}`}><Text className={chartType === 'doughnut' ? 'text-white' : 'text-gray-700'}>Doughnut</Text></TouchableOpacity>
          </View>
          </View>
        </View>

        <View className="flex-1 h-full">
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4 py-2 space-y-4 max-h-[650px] overflow-y-scroll"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} text={msg.text} type={msg.type}>
                {msg.chartData && (
                  <ChartBlock
                    chartType={chartType}
                    chartData={msg.chartData}
                    graphHeight={graphHeight}
                    themeColors={getThemeColors()}
                  />
                )}
              </ChatMessage>
            ))}
            {loading && <ActivityIndicator className="mt-2" />}
          </ScrollView>
        </View>
        <View className="flex-row items-center px-4 py-3 border-t border-gray-100" style={{ backgroundColor: 'var(--color-surface)', boxShadow: '0 -1px 2px 0 rgba(0,0,0,0.03)' }}>
          <TextInput
            id='input-text'
            className="flex-1 rounded-full border border-gray-300 px-4 py-3 mr-2 bg-white text-base"
            placeholder="Type your question..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => setShowSamples((v) => !v)}
            className="rounded-full bg-gray-200 p-3 mr-2"
            accessibilityLabel="Show Sample Messages"
          >
            <MaterialIcons name="chat-bubble-outline" size={24} color="#555" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleFilePick}
            className="rounded-full bg-gray-200 p-3 mr-2"
            accessibilityLabel="Upload File"
            id='upload-file-button'
          >
            <MaterialIcons name="attach-file" size={24} color="#555" />
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-full bg-primary px-5 py-3"
            onPress={handleSend}
            disabled={loading || !input.trim() || !file}
            style={{ opacity: loading || !input.trim() || !file ? 0.5 : 1 }}
          >
            <Text className="text-white font-semibold">Send</Text>
          </TouchableOpacity>
          {showSamples && (
            <View style={{ position: 'absolute', bottom: 60, right: 90, zIndex: 50 }} className="bg-white border border-gray-200 rounded-xl shadow-lg p-2 w-64">
              {sampleMessages.map((msg, idx) => (
                <TouchableOpacity
                  key={idx}
                  className="py-2 px-3 hover:bg-gray-100 rounded"
                  onPress={() => {
                    setInput(msg);
                    setShowSamples(false);
                  }}
                >
                  <Text className="text-gray-800 text-sm">{msg}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

// Remove or replace the old HomeScreen content with a redirect to the main tab if needed, or leave it empty.
export function HomeScreen() {
  return null;
}
