import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Donutchart from './Donutchart';

interface DataPoint {
  name: string;
  onTrack?: number;
  completed?: number;
  atRisk?: number;
  onHold?: number;
  Delayed?: number;
  amt: number;
}

const barData: DataPoint[] = [
  { name: 'Tower 1', onTrack: 9, completed: 9, atRisk: 14, onHold: 14, Delayed: 7, amt: 2400 },
  { name: 'Tower 2', completed: 45, onTrack: 3, amt: 2210 },
  { name: 'Tower 3', completed: 40, amt: 2290 },
  { name: 'Tower 4', completed: 35, amt: 2000 },
  { name: 'Tower 5', completed: 30, amt: 2181 },
  { name: 'Tower S', atRisk: 20, amt: 2500 },
  { name: 'Tower S', atRisk: 20, amt: 2100 },
  { name: 'Tower S', atRisk: 20, amt: 2100 },
  { name: 'Tower S', atRisk: 20, amt: 2100 },
  { name: 'Tower S', atRisk: 20, amt: 2100 },
];

const WebBarChart: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.barChartContainer}>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={barData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Delayed" stackId="a" fill="#42A5F5" />
            <Bar dataKey="onTrack" stackId="a" fill="#4CAF50" />
            <Bar dataKey="completed" stackId="a" fill="#FBB203" />
            <Bar dataKey="atRisk" stackId="a" fill="#FF4795" />
            <Bar dataKey="onHold" stackId="a" fill="#DA77FE" />
          </BarChart>
        </ResponsiveContainer>
      </View>
      <View style={styles.pieChartContainer}>
        <Donutchart />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    padding: 10,
  },
  barChartContainer: {
    flex: 3,
    marginRight: 10,
  },
  pieChartContainer: {
    flex: 1,
    maxWidth: '40%',
  },
});

export default WebBarChart;
