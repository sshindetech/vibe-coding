import React, { useRef } from 'react';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import { MaterialIcons } from '@expo/vector-icons';

interface ChartBlockProps {
  chartType: 'line' | 'bar' | 'pie' | 'doughnut';
  chartData: any;
  graphHeight: number;
  themeColors: { primary: string; secondary: string; accent: string; danger: string };
}

export const ChartBlock: React.FC<ChartBlockProps> = ({ chartType, chartData, graphHeight, themeColors }) => {
  const chartRef = useRef<any>(null);
  if (!chartData) return null;
  const datasets = chartData.datasets.map((ds: any, i: number) => {
    if (chartType === 'pie' || chartType === 'doughnut') {
      return {
        ...ds,
        backgroundColor: ds.backgroundColor || [themeColors.primary, themeColors.secondary, themeColors.accent, themeColors.danger],
        borderColor: ds.borderColor || [themeColors.primary, themeColors.secondary, themeColors.accent, themeColors.danger],
      };
    }
    return {
      ...ds,
      borderColor: ds.borderColor || (i === 0 ? themeColors.primary : i === 1 ? themeColors.secondary : themeColors.accent),
      backgroundColor: ds.backgroundColor || (i === 0 ? themeColors.primary + '99' : i === 1 ? themeColors.secondary + '33' : themeColors.accent + '33'),
      pointBackgroundColor: ds.pointBackgroundColor || (i === 0 ? themeColors.primary : i === 1 ? themeColors.secondary : themeColors.accent),
    };
  });
  const data = { labels: chartData.labels, datasets };
  const options = {
    responsive: true,
    maintainAspectRatio: chartType === 'pie' || chartType === 'doughnut' ? false : true,
    plugins: {
      legend: { display: true, position: 'top' as const },
      title: { display: true, text: chartData.datasets[0]?.label || 'Chart' },
    },
  };

  // Print handler
  const handlePrint = () => {
    if (!chartRef.current) return;
    const chartCanvas = chartRef.current.canvas || chartRef.current;
    const dataUrl = chartCanvas.toDataURL();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<img src='${dataUrl}' style='max-width:100%;'/>`);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  // Helper to get icon color based on theme
  function getIconColor() {
    if (typeof window !== 'undefined') {
      const styles = getComputedStyle(document.body);
      return styles.getPropertyValue('--color-primary').trim() || '#1a237e';
    }
    return '#1a237e';
  }

  const chartProps = { data, options, height: graphHeight, ref: chartRef };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Overlay print button */}
      <button
        onClick={handlePrint}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 10,
          background: 'transparent',
          border: 'none',
          borderRadius: 4,
          padding: 4,
          cursor: 'pointer',
          boxShadow: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Print this chart"
      >
        <MaterialIcons name="print" size={20} color={getIconColor()} />
      </button>
      {chartType === 'line' && <Line {...chartProps} />}
      {chartType === 'bar' && <Bar {...chartProps} />}
      {chartType === 'pie' && <div style={{ width: '100%', height: graphHeight * 4 }}><Pie {...chartProps} /></div>}
      {chartType === 'doughnut' && <div style={{ width: '100%', height: graphHeight * 4 }}><Doughnut {...chartProps} /></div>}
    </div>
  );
};
