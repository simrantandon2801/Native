import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

interface AllocateInspectionDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  data: any;
}

const AllocateInspectionDetailsModal: React.FC<AllocateInspectionDetailsModalProps> = ({
  isVisible,
  onClose,
  data,
}) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.modalTitle}>Inspection Details</Text>
            {data && data.kobDetails && data.kobDetails.length > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>KOB Name:</Text>
                <Text style={styles.detailValue}>{data.kobDetails[0].kobname}</Text>
              </View>
            )}
            {/* Uncomment and use these sections if needed */}
            
            {data && data.auditRatingDetails && data.auditRatingDetails.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Audit Rating Details</Text>
                {data.auditRatingDetails.map((item, index) => (
                  <View key={index} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{item.key}:</Text>
                    <Text style={styles.detailValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            )}
            {data && data.hygineRatingDetails && data.hygineRatingDetails.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Hygiene Rating Details</Text>
                {data.hygineRatingDetails.map((item, index) => (
                  <View key={index} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{item.key}:</Text>
                    <Text style={styles.detailValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            )}
            {data && data.inspectionDetails && data.inspectionDetails.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Inspection Details</Text>
                {data.inspectionDetails.map((item, index) => (
                  <View key={index} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{item.key}:</Text>
                    <Text style={styles.detailValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            )} 
            
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: "bold",
    flex: 1,
  },
  detailValue: {
    flex: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: 100,
  },
  closeButtonText: {
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default AllocateInspectionDetailsModal;