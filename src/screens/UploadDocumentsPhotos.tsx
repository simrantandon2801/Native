import type React from "react"
import { useState,useEffect } from "react"
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Image, Alert } from "react-native"
import * as ImagePicker from "react-native-image-picker"
import { uploadInspectionDocument } from "../database/UploadImageapi"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect, useNavigation, useRoute, type RouteProp } from "@react-navigation/native"

interface UploadDocumentsProps {
  visible: boolean
  onClose: () => void
  sectionId: number | null
  sectionName: string
  inspectionId:any 
}
// type SectionType = {
//   sectionId: number;
//   sectionName: string;
//   submittedFlag: boolean;
// };
// type RouteParams = {
//   parameterRegResults: any[]
//   inspectionId:any
// }
const UploadDocumentsPhotos: React.FC<UploadDocumentsProps> = ({ visible, onClose, sectionId,}) => {
    const route = useRoute<RouteProp<Record<string, UploadDocumentsProps>>>()
    const { inspectionId, sectionName  } = route.params
  console.log("inspectionId",inspectionId,"sectio",sectionName)
  const [documentName, setDocumentName] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const pickImage = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 1,
    }

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage)
        Alert.alert("Error", response.errorMessage || "Error selecting image")
      } else if (response.assets && response.assets.length > 0) {
        const selectedAsset = response.assets[0]
        
        // Check file size (3MB limit = 3 * 1024 * 1024 bytes)
        if (selectedAsset.fileSize && selectedAsset.fileSize > 3 * 1024 * 1024) {
          Alert.alert("File too large", "Image file size should be less than 3 MB")
          return
        }

        setSelectedImage(selectedAsset.uri || null)
      }
    })
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
      createdBy:userId,
      inspectionId: inspectionId,
      updatedBy: userId,
      documentDesc: documentName 
    }
    
   console.log("upload payload",payload)
    await uploadInspectionDocument(selectedImage,payload)
    
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
    console.log("handleClose called");
  
    // Reset all states
    setDocumentName("");
    setSelectedImage(null);
    setUploading(false);
  
    
    if (onClose) {
      console.log("Calling onClose");
      onClose();
    }
  };

  return (
    <Modal animationType="none" transparent={true} visible={visible} onRequestClose={() => {
      console.log("onRequestClose triggered");
      handleClose();
    }}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Close Icon */}
          <TouchableOpacity style={styles.closeButtonIcon} onPress={handleClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Upload Documents</Text>
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

          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
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
  },
  closeButtonIcon: {
    position: "absolute",
    top: 10,
    right: 10,
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
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
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
    fontStyle: "italic",
  },
  cancelButton: {
    padding: 10,
    alignItems: "center",
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
})

export default UploadDocumentsPhotos