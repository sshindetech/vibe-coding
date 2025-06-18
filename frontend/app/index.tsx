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
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
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

export default function MainScreen() {
  const graphHeight = 100; // Default height for charts
  const [file, setFile] = useState<any>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'doughnut'>('bar');
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
      setFile(result.assets[0].file);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { type: 'user', text: input }]);
    setLoading(true);
    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('query', input);
    setInput('');
    try {
      const response = await fetch('http://localhost:3000/analyze', {
        method: 'POST',
        body: formData,
        headers: { 'accept': 'application/json' },
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
    <View className="w-full mt-2 min-h-[700px] rounded-md mx-auto bg-background border border-gray-200 overflow-hidden flex-1">
      <View className="flex  px-4 py-3 bg-gray-200 border-b border-gray-100">
        <View className='flex-row items-center justify-between'>
<Text className="text-lg font-bold text-primary">Chat Assistant</Text>
        {file && (
          <View className="flex-row items-center ml-4">
            <MaterialIcons name="attach-file" size={20} color="#555" />
            <Text className="ml-1 text-sm text-gray-700 max-w-[160px] truncate">{file.name || file.uri || 'Selected File'}</Text>
          </View>
        )}          
        </View>
      {/* Chart type selector */}
      <View className="flex-row items-center space-x-2">
        <Text className="text-sm font-semibold text-gray-700 mr-2">Chart Type:</Text>
        <TouchableOpacity onPress={() => setChartType('line')} className={`px-3 py-1 rounded ${chartType === 'line' ? 'bg-primary' : 'bg-gray-200'}`}><Text className={chartType === 'line' ? 'text-white' : 'text-gray-700'}>Line</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setChartType('bar')} className={`px-3 py-1 rounded ${chartType === 'bar' ? 'bg-primary' : 'bg-gray-200'}`}><Text className={chartType === 'bar' ? 'text-white' : 'text-gray-700'}>Bar</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setChartType('pie')} className={`px-3 py-1 rounded ${chartType === 'pie' ? 'bg-primary' : 'bg-gray-200'}`}><Text className={chartType === 'pie' ? 'text-white' : 'text-gray-700'}>Pie</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setChartType('doughnut')} className={`px-3 py-1 rounded ${chartType === 'doughnut' ? 'bg-primary' : 'bg-gray-200'}`}><Text className={chartType === 'doughnut' ? 'text-white' : 'text-gray-700'}>Doughnut</Text></TouchableOpacity>
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
            <View key={idx} className={`w-full flex ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
              <View className={`rounded-xl px-4 m-2 py-2 max-w-[80%] ${msg.type === 'user' ? 'bg-primary self-end' : 'bg-gray-200 self-start'} ${msg.type === 'user' ? 'mr-2' : 'ml-2'}`}
                style={{ marginBottom: 2, backgroundColor: msg.type === 'user' ? 'var(--color-primary)' : 'var(--color-surface)' }}
              >
                <Text style={{ color: msg.type === 'user' ? '#fff' : 'var(--color-text)' }}>{msg.text}</Text>
              </View>
              {msg.chartData && (
                <View className="w-full bg-white rounded-xl mt-2 p-2 border border-gray-200">
                  {(() => {
                    const themeColors = getThemeColors();
                    return (
                      <>
                        {chartType === 'line' && (
                          <Line
                            data={{
                              labels: msg.chartData.labels,
                              datasets: msg.chartData.datasets.map((ds: any, i: number) => ({
                                ...ds,
                                borderColor: ds.borderColor || (i === 0 ? themeColors.primary : i === 1 ? themeColors.secondary : themeColors.accent),
                                backgroundColor: ds.backgroundColor || (i === 0 ? themeColors.primary + '33' : i === 1 ? themeColors.secondary + '33' : themeColors.accent + '33'),
                                pointBackgroundColor: ds.pointBackgroundColor || (i === 0 ? themeColors.primary : i === 1 ? themeColors.secondary : themeColors.accent),
                              })),
                            }}
                            options={{
                              responsive: true,
                              plugins: {
                                legend: { display: true, position: 'top' },
                                title: { display: true, text: msg.chartData.datasets[0]?.label || 'Chart' },
                              },
                            }}
                            height={graphHeight}
                          />
                        )}
                        {chartType === 'bar' && (
                          <Bar
                            data={{
                              labels: msg.chartData.labels,
                              datasets: msg.chartData.datasets.map((ds: any, i: number) => ({
                                ...ds,
                                backgroundColor: ds.backgroundColor || (i === 0 ? themeColors.primary : i === 1 ? themeColors.secondary : themeColors.accent),
                                borderColor: ds.borderColor || (i === 0 ? themeColors.primary : i === 1 ? themeColors.secondary : themeColors.accent),
                              })),
                            }}
                            options={{
                              responsive: true,
                              plugins: {
                                legend: { display: true, position: 'top' },
                                title: { display: true, text: msg.chartData.datasets[0]?.label || 'Chart' },
                              },
                            }}
                            height={graphHeight}
                          />
                        )}
                        {chartType === 'pie' && (
                          <div style={{ width: '100%', height: graphHeight * 4 }}>
                            <Pie
                              data={{
                                labels: msg.chartData.labels,
                                datasets: msg.chartData.datasets.map((ds: any) => ({
                                  ...ds,
                                  backgroundColor: ds.backgroundColor || [themeColors.primary, themeColors.secondary, themeColors.accent, themeColors.danger],
                                  borderColor: ds.borderColor || [themeColors.primary, themeColors.secondary, themeColors.accent, themeColors.danger],
                                })),
                              }}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                  legend: { display: true, position: 'top' },
                                  title: { display: true, text: msg.chartData.datasets[0]?.label || 'Chart' },
                                },
                              }}
                            />
                          </div>
                        )}
                        {chartType === 'doughnut' && (
                          <div style={{ width: '100%', height: graphHeight * 4 }}>
                            <Doughnut
                              data={{
                                labels: msg.chartData.labels,
                                datasets: msg.chartData.datasets.map((ds: any) => ({
                                  ...ds,
                                  backgroundColor: ds.backgroundColor || [themeColors.primary, themeColors.secondary, themeColors.accent, themeColors.danger],
                                  borderColor: ds.borderColor || [themeColors.primary, themeColors.secondary, themeColors.accent, themeColors.danger],
                                })),
                              }}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                  legend: { display: true, position: 'top' },
                                  title: { display: true, text: msg.chartData.datasets[0]?.label || 'Chart' },
                                },
                              }}
                            />
                          </div>
                        )}
                      </>
                    );
                  })()}
                </View>
              )}
            </View>
          ))}
          {loading && <ActivityIndicator className="mt-2" />}
        </ScrollView>
      </View>
      <View className="flex-row items-center px-4 py-3 bg-surface border-t border-gray-100">
        <TextInput
          className="flex-1 rounded-full border border-gray-300 px-4 py-3 mr-2 bg-white text-base"
          placeholder="Type your question..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          editable={!loading}
        />
        <TouchableOpacity
          onPress={handleFilePick}
          className="rounded-full bg-gray-200 p-3 mr-2"
          accessibilityLabel="Upload File"
        >
          <MaterialIcons name="attach-file" size={24} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity
          className="rounded-full bg-primary px-5 py-3"
          onPress={handleSend}
          disabled={
            loading || !input.trim() || !file
          }
          style={{ opacity: loading || !input.trim() || !file ? 0.5 : 1 }}
        >
          <Text className="text-white font-semibold">Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Remove or replace the old HomeScreen content with a redirect to the main tab if needed, or leave it empty.
export function HomeScreen() {
  return null;
}
