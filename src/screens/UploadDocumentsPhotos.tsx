"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Image, Alert, ScrollView } from "react-native"
import * as ImagePicker from "react-native-image-picker"
import { uploadInspectionDocument } from "../database/UploadImageapi"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRoute, type RouteProp } from "@react-navigation/native"
import { deleteInspectionDocument, getInspectionDocuments } from "../database/DocumentListapi"
import { DataTable } from "react-native-paper"
interface UploadDocumentsProps {
  visible: boolean
  onClose: () => void
  sectionId: number | null
  sectionName: string
  inspectionId: any
}

const UploadDocumentsPhotos: React.FC<UploadDocumentsProps> = ({ visible, onClose, sectionId }) => {
  const route = useRoute<RouteProp<Record<string, UploadDocumentsProps>>>()
  const { inspectionId, sectionName } = route.params
  console.log("inspectionId", inspectionId, "sectio", sectionName)
  const [documentName, setDocumentName] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [viewImageModal, setViewImageModal] = useState(false)
  const [currentImage, setCurrentImage] = useState<string | null>(null)

  const pickImage = async () => {
    const options = {
      mediaType: "photo",
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 1,
    }

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker")
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage)
        Alert.alert("Error", response.errorMessage || "Error selecting image")
      } else if (response.assets && response.assets.length > 0) {
        const selectedAsset = response.assets[0]

        if (selectedAsset.fileSize && selectedAsset.fileSize > 3 * 1024 * 1024) {
          Alert.alert("File too large", "Image file size should be less than 3 MB")
          return
        }

        setSelectedImage(selectedAsset.uri || null)
      }
    })
  }

  useEffect(() => {
    if (inspectionId) {
      fetchDocuments()
    }
  }, [inspectionId])

  useEffect(() => {
    if (visible && inspectionId) {
      fetchDocuments()
    }
  }, [visible])

  const fetchDocuments = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching documents for inspectionId:", inspectionId)
      const fetchedDocuments = await getInspectionDocuments(inspectionId)
      console.log("Fetched documents:", fetchedDocuments)
      setDocuments(Array.isArray(fetchedDocuments) ? fetchedDocuments : [])
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to fetch documents:", error)
      setError("Failed to fetch documents")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchDataFromAsyncStorage = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const storedUserId = await AsyncStorage.getItem("userId")

        setUserId(storedUserId)

        console.log("Retrieved Data:", {
          userId: storedUserId,
        })
      } catch (err) {
        console.error("Error fetching data from AsyncStorage:", err)
        setError("Failed to load data from storage.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDataFromAsyncStorage()
  }, [])

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select an image first")
      return
    }

    if (!documentName.trim()) {
      Alert.alert("Error", "Please enter a document name")
      return
    }

    try {
      setUploading(true)

      const payload = {
        createdBy: userId,
        inspectionId: inspectionId,
        updatedBy: userId,
        documentDesc: documentName,
      }

      console.log("upload payload", payload)
      await uploadInspectionDocument(selectedImage, payload)

      // Add this line to refresh the documents list
      await fetchDocuments()

      Alert.alert("Success", "Document uploaded successfully")
      handleClose()
    } catch (error) {
      console.error("Error uploading image:", error)
      Alert.alert("Error", "Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    console.log("handleClose called")

    setDocumentName("")
    setSelectedImage(null)
    setUploading(false)

    if (onClose) {
      console.log("Calling onClose")
      onClose()
    }
  }

  const handleViewImage = (imageUrl: string) => {
    console.log("Image URLAa:", imageUrl); // Debugging
    setCurrentImage(imageUrl);
    setViewImageModal(true);
  };
  

  const handleDeleteDocument = async (documentId: string) => {
    try {
      console.log("Deleting document with ID:", documentId)

   
   

     
      const response = await deleteInspectionDocument(documentId)
      console.log("API Response:", response)
      setDocuments((prevDocuments) => prevDocuments.filter((doc) => doc.documentId !== documentId))
      Alert.alert("Success", "Document deleted successfully")
    } catch (error) {
      console.error("Error deleting document:", error)
      Alert.alert("Error", "Failed to delete document.")
      // Refresh documents to restore the original state in case of error
      fetchDocuments()
    }
  }

  return (
    <View>
      <Modal
        animationType="none"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          console.log("onRequestClose triggered")
          handleClose()
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButtonIcon} onPress={handleClose}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.sectionNameText}>{sectionName}</Text>

            <Text style={styles.inputLabel}>Document Name</Text>
            <TextInput
              style={styles.textInput}
              value={documentName}
              onChangeText={setDocumentName}
              placeholder="Enter document name"
            />

            {selectedImage && <Image source={{ uri: selectedImage }} style={styles.previewImage} />}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Choose Image</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, uploading && styles.disabledButton]}
                onPress={uploadImage}
                disabled={uploading}
              >
                <Text style={styles.buttonText}>{uploading ? "Uploading..." : "Upload Image"}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.noteText}>Note: Image file size should be less than 3 MB</Text>

            <Text style={styles.documentListTitle}>Uploaded Documents</Text>

            <View style={styles.tableContainer}>
              <DataTable.Header>
                <DataTable.Title style={{ flex: 2 }}>Document Name</DataTable.Title>
                <DataTable.Title style={{ flex: 1 }}>Actions</DataTable.Title>
              </DataTable.Header>

              <ScrollView style={styles.tableBody}>
                {isLoading ? (
                  <Text style={styles.emptyText}>Loading documents...</Text>
                ) : error ? (
                  <Text style={styles.emptyText}>Error: {error}</Text>
                ) : documents.length > 0 ? (
                  documents.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                      <Text style={[styles.tableCell, { flex: 2 }]} numberOfLines={1} ellipsizeMode="tail">
                        {item.documentDesc}
                      </Text>
                      <View style={[styles.tableCell, { flexDirection: "row" }]}>
                        {/* <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleViewImage(item.documentPath)}
                        >
                          <Text style={styles.actionButtonText}>View</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity
                          style={[styles.actionButton, styles.deleteButton]}
                          onPress={() => handleDeleteDocument(item.documentId)}
                        >
                          <Text style={styles.actionButtonText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No documents uploaded yet.</Text>
                )}
              </ScrollView>
            </View>

            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={viewImageModal}
        onRequestClose={() => setViewImageModal(false)}
      >
        <View style={styles.imageModalOverlay}>
          <View style={styles.imageModalContent}>
            <TouchableOpacity style={styles.closeImageButton} onPress={() => setViewImageModal(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            {currentImage ? (
              <Image source={{ uri: currentImage }} style={styles.fullImage} resizeMode="contain" />
            ) : (
              <Text style={styles.emptyText}>No image available</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  documentName: {
    fontSize: 16,
    fontWeight: "500",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    padding: 15,
  },
  documentList: {
    marginTop: 20,
  },
  documentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  buttonTextC: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  Bcontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginTop: 40,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: "90%",
  },
  closeButtonIcon: {
    position: "absolute",
    top: 15,
    right: 30,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  sectionNameText: {
    fontSize: 18,
    color: "#000",
    marginBottom: 25,
    fontWeight: "400",
    textAlign: "center",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    flex: 0.48,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  noteText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 15,
    fontStyle: "normal",
  },
  cancelButton: {
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  previewImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 15,
    borderRadius: 5,
  },
  documentListTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
    maxHeight: 200,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableHeaderCell: {
    fontWeight: "bold",
    paddingHorizontal: 10,
    fontSize: 14,
  },
  tableBody: {
    maxHeight: 150,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  tableCell: {
    padding: 10,
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  actionButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalContent: {
    width: "90%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    position: "relative",
  },
  closeImageButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
})

export default UploadDocumentsPhotos

