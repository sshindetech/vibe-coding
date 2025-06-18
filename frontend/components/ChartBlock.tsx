import React from 'react';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';

interface ChartBlockProps {
  chartType: 'line' | 'bar' | 'pie' | 'doughnut';
  chartData: any;
  graphHeight: number;
  themeColors: { primary: string; secondary: string; accent: string; danger: string };
}

export const ChartBlock: React.FC<ChartBlockProps> = ({ chartType, chartData, graphHeight, themeColors }) => {
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
  if (chartType === 'line') return <Line data={data} options={options} height={graphHeight} />;
  if (chartType === 'bar') return <Bar data={data} options={options} height={graphHeight} />;
  if (chartType === 'pie') return <div style={{ width: '100%', height: graphHeight * 4}}><Pie data={data} options={options} height={graphHeight}/></div>;
  if (chartType === 'doughnut') return <div style={{ width: '100%', height: graphHeight * 4}}><Doughnut data={data} options={options} /></div>;
  return null;
};
