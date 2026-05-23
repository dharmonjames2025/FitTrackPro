import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

interface ChartProps {
  type: 'line' | 'bar';
  data: {
    labels: string[];
    datasets: {
      data: number[];
      color?: (opacity: number) => string;
      strokeWidth?: number;
    }[];
  };
  title?: string;
  yAxisSuffix?: string;
  yAxisLabel?: string;
  height?: number;
  width?: number;
}

const screenWidth = Dimensions.get('window').width;

export const Chart: React.FC<ChartProps> = ({
  type,
  data,
  title,
  yAxisSuffix = '',
  yAxisLabel = '',
  height = 220,
  width = screenWidth - 48,
}) => {
  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalCount: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(28, 28, 30, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#007AFF',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#E5E5EA',
      strokeWidth: 1,
    },
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {type === 'line' ? (
        <LineChart
          data={data}
          width={width}
          height={height}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          yAxisSuffix={yAxisSuffix}
          yAxisLabel={yAxisLabel}
          withInnerLines={true}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          withVerticalLabels={true}
          withHorizontalLabels={true}
        />
      ) : (
        <BarChart
          data={data}
          width={width}
          height={height}
          chartConfig={chartConfig}
          style={styles.chart}
          yAxisSuffix={yAxisSuffix}
          yAxisLabel={yAxisLabel}
          withInnerLines={true}
          showValuesOnTopOfBars
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
    marginLeft: -8,
  },
});