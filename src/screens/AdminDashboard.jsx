import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Image,
} from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import { AppImages } from '../../assets';

const screenWidth = Dimensions.get('window').width;

const AdminDashBoard: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('');
  const [selectedProjects, setSelectedProjects] = useState('');
  const [selectedGoals, setSelectedGoals] = useState('');
  const [selectedClassification, setSelectedClassification] = useState('');

  const barData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        data: [65, 80, 50, 95],
      },
    ],
  };

  const pieData = [
    { name: 'Complete', population: 70, color: '#FBB203', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'In Progress', population: 20, color: '#FF4795', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Not Started', population: 10, color: '#6200ee', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  ];
  const projectData = [
    { name: 'Project 1', progress: 75, progressColors: { dark: '#76C043', light: '#CEE4BE' }, priority: 'High', currentStatus: 'On Track', lastStatus: 'Delayed', classification: 'Business', endDate: '2023-12-31', manager: 'John Doe', status: 'On Track' },
    { name: 'Project 2', progress: 50, progressColors: { dark: '#EA916E', light: '#F8DBD0' }, priority: 'Medium', currentStatus: 'Delayed', lastStatus: 'On Track', classification: 'Strategy', endDate: '2024-03-15', manager: 'Jane Smith', status: 'Delayed' },
    { name: 'Project 3', progress: 25, progressColors: { dark: '#EACF02', light: '#EEEBD3' }, priority: 'Low', currentStatus: 'Draft', lastStatus: 'On Track', classification: 'Operation', endDate: '2024-06-30', manager: 'Bob Johnson', status: 'Delayed' },
  ];
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontFamily: 'Source Sans Pro',
    },
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>Dashboard</Text>
          <TouchableOpacity style={styles.addButton}>
            <Icon name="add" size={24} color="#044086" />
            <Text style={styles.addButtonText}>Add New Project</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statusSection}>
          <Text style={styles.subheading}>Today's Status</Text>
          <View style={styles.filterButtons}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedDepartment}
                  onValueChange={(itemValue) => setSelectedDepartment(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Department" value="" />
                  <Picker.Item label="HR" value="hr" />
                  <Picker.Item label="IT" value="it" />
                  <Picker.Item label="Finance" value="finance" />
                </Picker>
                {/* Icon removed */}
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedStatus}
                  onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Status" value="" />
                  <Picker.Item label="Active" value="active" />
                  <Picker.Item label="Inactive" value="inactive" />
                  <Picker.Item label="On Hold" value="on_hold" />
                </Picker>
                {/* Icon removed */}
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedGoals}
                  onValueChange={(itemValue) => setSelectedGoals(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Goals" value="" />
                  <Picker.Item label="Achieved" value="achieved" />
                  <Picker.Item label="In Progress" value="in_progress" />
                  <Picker.Item label="Not Started" value="not_started" />
                </Picker>
                {/* Icon removed */}
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedClassification}
                  onValueChange={(itemValue) => setSelectedClassification(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Classification" value="" />
                  <Picker.Item label="High Priority" value="high_priority" />
                  <Picker.Item label="Medium Priority" value="medium_priority" />
                  <Picker.Item label="Low Priority" value="low_priority" />
                </Picker>
                {/* Icon removed */}
              </View>
            </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.metricsButtonsContainer}>
          <View style={styles.metricsButtons}>
            {['Metric 1', 'Metric 2', 'Metric 3', 'Metric 4', 'Metric 5', 'Metric 6'].map(
              (metric, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.metricButton, styles[`metricButton${index + 1}`]]}
                >
                  <Text style={styles.metricButtonText}>{metric}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </ScrollView>

        <View style={styles.performanceSection}>
          <Text style={styles.performanceHeading}>Performance Metrics</Text>
       
        </View>
        <View style={styles.projectStatusContainer}>
        <Text style={styles.projectStatusText}>Project Status</Text>
      </View>

        <View style={styles.chartsContainer}>
      {/* Left Column */}
      <View style={styles.leftColumn}>
        <Image
          source={AppImages.Bargra}
          style={styles.dashboardImage}
        />
      </View>
      
      {/* Right Column */}
      <View style={styles.rightColumn}>
      <View style={styles.budgetUtilizationContainer}>
    <Text style={styles.budgetUtilizationText}>Budget Utilization</Text>
  </View>
        <Image
          source={AppImages.Donut1}
          style={styles.donutImage}
        />
        <View style={styles.resourcesUtilizationContainer}>
    <Text style={styles.resourcesUtilizationText}>
      Resources Utilization vs Departments
    </Text>
  </View>
        <Image
          source={AppImages.Donut2}
          style={styles.donutImage}
        />
      </View>
    </View>
    <View style={styles.container1}>
      <Text style={styles.heading1}>Project List</Text>
      <View>
        <View style={styles.headerRow}>
          {['Project Name', 'Progress', 'Priority', 'Current Status', 'Last Status', 'Classification', 'Tentative End Date', 'Project Manager', 'Status'].map((header, index) => (
            <Text key={index} style={styles.headerCell}>{header}</Text>
          ))}
        </View>
        {projectData.map((project, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}>{project.name}</Text>
            <View style={styles.cell}>
              <View style={[styles.progressBarBackground, { backgroundColor: project.progressColors.light }]}>
                <View style={[styles.progressBar, { width: `${project.progress}%`, backgroundColor: project.progressColors.dark }]} />
              </View>
            </View>
            <Text style={[styles.cell, styles[`priority${project.priority}`]]}>{project.priority}</Text>
            <Text style={styles.cell}>{project.currentStatus}</Text>
            <Text style={styles.cell}>{project.lastStatus}</Text>
            <Text style={styles.cell}>{project.classification}</Text>
            <Text style={styles.cell}>{project.endDate}</Text>
            <Text style={styles.cell}>{project.manager}</Text>
            <Text style={styles.cell}>{project.status}</Text>
          </View>
        ))}
      </View>
    </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Outfit-Medium',
    textAlign: 'center',
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    width: 183,
    minWidth: 180,
    gap: 6,
  },
  addButtonText: {
    color: '#044086',
    marginLeft: 6,
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
  statusSection: {
    marginBottom: 20,
  },
  statusContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subheading: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    marginBottom: 10,
    color: '#000',
    fontFamily: 'Outfit',
    textTransform: 'capitalize',
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  budgetUtilizationContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 6,
    alignSelf: 'stretch',
    borderRadius: 5,
    backgroundColor: '#F5F5F5',
  },
  budgetUtilizationText: {
    fontFamily: 'Outfit',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 22,
    textTransform: 'capitalize',
    color: '#000',
  },
  resourcesUtilizationContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 6,
    alignSelf: 'stretch',
    borderRadius: 5,
    backgroundColor: '#F5F5F5',
    marginTop:20
  },
  resourcesUtilizationText: {
    fontFamily: 'Outfit',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 22,
    textTransform: 'capitalize',
    color: '#000',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C4C4C4',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    minWidth: 150,
    height: 40,
    marginBottom: 10,
  },
  picker: {
    flex: 1,
  },
  projectStatusContainer: {
    display: 'flex',
    flexDirection: 'row', // To align text horizontally if needed
    padding: 10,
    alignItems: 'center',
    gap: 6,
   
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    marginHorizontal: 10, // To align with padding in chartsContainer
    marginBottom: 10,
    width:'62%'
  },
  projectStatusText: {
    color: '#000',
    fontFamily: 'Outfit',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22, // Matches 137.5% line-height
    textTransform: 'capitalize',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#C4C4C4',
    paddingVertical: 8,
    marginRight: 10,
  },
  dropdownButtonText: {
    color: '#232323',
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
  },
  metricsButtonsContainer: {
    marginBottom: 20,
  },
  metricsButtons: {
    flexDirection: 'row',
  },
  metricButton: {
    width: 150,
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  metricButton1: {
    backgroundColor: '#F1F1F1',
    borderColor: '#C4C4C4',
    borderWidth: 1,
  },
  metricButton2: {
    backgroundColor: '#FEF9EE',
    borderColor: '#FBB203',
    borderWidth: 1,
  },
  metricButton3: {
    backgroundColor: '#E5F4FF',
    borderColor: '#42A5F5',
    borderWidth: 1,
  },
  metricButton4: {
    backgroundColor: '#EEFDF3',
    borderColor: '#129D42',
    borderWidth: 1,
  },
  metricButton5: {
    backgroundColor: '#FEF0EE',
    borderColor: '#FB0307',
    borderWidth: 1,
  },
  metricButton6: {
    backgroundColor: '#D1D1D1',
    borderColor: '#575757',
    borderWidth: 1,
  },
  metricButtonText: {
    color: '#000',
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
  performanceSection: {
    marginBottom: 20,
  },
  performanceHeading: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    marginBottom: 10,
    color: '#000',
    fontFamily: 'Outfit',
    textTransform: 'capitalize',
  },
  chartFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  chartContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#000',
    fontFamily: 'Outfit',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  leftColumn: {
    flex: 2,
    marginRight: 10,
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop:-50
  },
  dashboardImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  donutImage: {
    width: '100%',
    height: 145,
    resizeMode: 'contain',
  },
  container1: {
    marginTop: 20,
    marginBottom: 20,
  },
  heading1: {
    color: '#000',
    fontFamily: 'Outfit',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 22,
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    marginRight: 10,
  },
  progressBarBackground: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  priorityLow: {
    color: '#232323',
    fontFamily: 'Source Sans Pro',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
    display: 'flex',
    padding: 0,
    paddingHorizontal: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
  },
  priorityMedium: {
    color: '#1B7A01',
    fontFamily: 'Source Sans Pro',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
    display: 'flex',
    padding: 0,
    paddingHorizontal: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#DAFFD4',
  },
  priorityHigh: {
    color: '#B50707',
    fontFamily: 'Source Sans Pro',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
    display: 'flex',
    padding: 0,
    paddingHorizontal: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#FFD4D4',
  },
});

export default AdminDashBoard;

