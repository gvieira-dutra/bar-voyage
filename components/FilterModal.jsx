// FilterModal.js
import {
  backgroundColor,
  lightGrey,
  primary,
  secondary,
  tintColorLight,
} from "@/constants/ThemeVariables";
import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function FilterModal({
  visible,
  onClose,
  onApply,
  onSort,
  defaultSort,
}) {
  const [selectedOption, setSelectedOption] = useState(defaultSort);

  useEffect(() => {
    setSelectedOption(defaultSort);
  }, [defaultSort]);

  const handleSort = (option) => {
    setSelectedOption(option);
    onSort(option);
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Filter and Sort</Text>
          <TouchableOpacity
            style={[
              styles.button,
              selectedOption === "default" ? styles.selectedButton : null,
            ]}
            onPress={() => handleSort("default")}
          >
            <Text style={styles.buttonText}>Default Order</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              selectedOption === "alphabetical" ? styles.selectedButton : null,
            ]}
            onPress={() => handleSort("alphabetical")}
          >
            <Text style={styles.buttonText}>Sort Alphabetically</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              selectedOption === "ranking" ? styles.selectedButton : null,
            ]}
            onPress={() => handleSort("ranking")}
          >
            <Text style={styles.buttonText}>Sort by Ranking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={onApply}>
            <Text style={styles.buttonText}>Apply</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: backgroundColor,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: tintColorLight,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  applyButton: {
    backgroundColor: tintColorLight,
    padding: 10,
    borderRadius: 5,
    marginTop: 40,
    width: "100%",
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: primary,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
