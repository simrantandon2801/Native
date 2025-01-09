import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

interface Department {
  name: string;
  value: number;
  fill: string;
}

interface BudgetData {
  name: string;
  value: number;
  fill: string;
}

const Donutchart: React.FC = () => {
  const departmentData: Department[] = [
    { name: 'IT', value: 20, fill: '#4CAF50' },
    { name: 'Finance', value: 80, fill: '#2196F3' },
    { name: 'Other', value: 100, fill: '#FF5722' },
  ];

  const budgetData: BudgetData[] = [
    { name: 'Over Budget', value: 30, fill: '#FF5722' },
    { name: 'Budget Fully Utilized', value: 45, fill: '#4CAF50' },
    { name: 'Within Budget', value: 25, fill: '#2196F3' },
  ];

  return (
    <View style={styles.container}>
      {/* Budget Utilization Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Budget Utilization</Text>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={budgetData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
           
              dataKey="value"
              startAngle={610} 
              endAngle={300} 
            >
              {budgetData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              height={36}
              content={({ payload }) => (
                <View style={styles.legend}>
                  {payload.map((entry, index) => (
                    <View key={`legend-${index}`} style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendColor,
                          { backgroundColor: entry.color },
                        ]}
                      />
                      <Text style={styles.legendText}>
                        {entry.value} ({budgetData[index].value}%)
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <View style={styles.needleContainer}>
    <View style={styles.needle} />
  </View>
      </View>

      {/* Resources Utilization Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Resources Utilization Vs Departments</Text>
        <View style={styles.totalResources}>
          <Text style={styles.totalText}>Total Resources</Text>
          <Text style={styles.totalValue}>200</Text>
        </View>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={departmentData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {departmentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              height={36}
              content={({ payload }) => (
                <View style={styles.legend}>
                  {payload.map((entry, index) => (
                    <View key={`legend-${index}`} style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendColor,
                          { backgroundColor: entry.color },
                        ]}
                      />
                      <Text style={styles.legendText}>
                        {entry.value} ({departmentData[index].value})
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-between',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    marginTop:24
  },
  legend: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 10,
  },
  totalResources: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -20 }],
    alignItems: 'center',
    zIndex: 1,
  },
  totalText: {
    fontSize: 10,
    color: '#666',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  needleContainer: {
    position: 'absolute',
    top: '85%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -100 }],
    width: 20,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  needle: {
    width: 4,
    height: 60,
    backgroundColor: '#000', // Needle color
    transform: [{ rotate: '-45deg' }], // Needle pointing slightly left
  },
});

export default Donutchart;

