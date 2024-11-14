import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import { lightGrey, primary } from "../constants/ThemeVariables";

const vibesList = [
  { name: "Luxury", key: "luxury" },
  { name: "Hipster", key: "hipster" },
  { name: "Gastro", key: "gastro" },
  { name: "Live Music", key: "liveMusic" },
  { name: "Theme", key: "theme" },
  { name: "Drinking", key: "drinking" },
  { name: "Dance", key: "dance" },
  { name: "Outdoor", key: "outdoor" },
  { name: "Date Night", key: "dateNight" },
  { name: "Chill", key: "chill" },
];

const ReviewModal = ({ visible, onClose }) => {
  const [overallThoughts, setOverallThoughts] = useState(5); // Assuming the thoughts are now a numerical rating
  const [selectedRatings, setSelectedRatings] = useState(
    vibesList.reduce((acc, vibe) => {
      acc[vibe.key] = 0;
      return acc;
    }, {})
  );
  const [barName, setBarName] = useState("");

  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchBarDetails = async () => {
      try {
        const response = await fetch(
          `https://bar-voyage-4a471-default-rtdb.europe-west1.firebasedatabase.app/bars/${id}.json`
        );
        const barDetails = await response.json();
        setBarName(barDetails.name || "Unknown Bar");
      } catch (error) {
        console.error("Error fetching bar details:", error);
      }
    };

    if (id) {
      fetchBarDetails();
    }
  }, [id]);

  const submitReview = async () => {
    try {
      const response = await fetch(
        `https://bar-voyage-4a471-default-rtdb.europe-west1.firebasedatabase.app/bars/${id}.json`
      );
      const currentData = (await response.json()) || {};
      const currentVibes = currentData.vibe || {};
      const currentOverallReviews = currentData.overallReviews || {
        numberOfVotes: 0,
        totalVotes: 0,
      };

      const updatedVibes = { ...currentVibes };
      Object.keys(selectedRatings).forEach((vibeKey) => {
        if (selectedRatings[vibeKey] > 0) {
          if (updatedVibes[vibeKey]) {
            updatedVibes[vibeKey].numberOfVotes =
              (parseInt(updatedVibes[vibeKey].numberOfVotes, 10) || 0) + 1;
            updatedVibes[vibeKey].totalVotes =
              (parseInt(updatedVibes[vibeKey].totalVotes, 10) || 0) +
              parseInt(selectedRatings[vibeKey], 10);
          } else {
            updatedVibes[vibeKey] = {
              numberOfVotes: 1,
              totalVotes: parseInt(selectedRatings[vibeKey], 10),
            };
          }
        }
      });

      const updatedOverallReviews = {
        numberOfVotes:
          (parseInt(currentOverallReviews.numberOfVotes, 10) || 0) + 1,
        totalVotes:
          (parseInt(currentOverallReviews.totalVotes, 10) || 0) +
          parseInt(overallThoughts, 10),
      };

      await fetch(
        `https://bar-voyage-4a471-default-rtdb.europe-west1.firebasedatabase.app/bars/${id}.json`,
        {
          method: "PATCH",
          body: JSON.stringify({
            vibe: updatedVibes,
            overallReviews: updatedOverallReviews,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      onClose();
    } catch (error) {
      console.error("Error updating vibes and overall reviews:", error);
    }
  };

  function onClose() {
    router.back();
  }

  const handleRatingChange = (vibeKey, value) => {
    setSelectedRatings((prevRatings) => ({
      ...prevRatings,
      [vibeKey]: value,
    }));
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Submit Your Review For</Text>
          <Text style={styles.modalTitleName}>{barName}</Text>
          <Text style={styles.vibesTitle}>Overall Rating:</Text>
          <Picker
            selectedValue={overallThoughts}
            style={styles.picker}
            onValueChange={(itemValue) => setOverallThoughts(itemValue)}
          >
            <Picker.Item label="5" value={5} />
            <Picker.Item label="4" value={4} />
            <Picker.Item label="3" value={3} />
            <Picker.Item label="2" value={2} />
            <Picker.Item label="1" value={1} />
          </Picker>
          <View style={styles.vibesContainer}>
            <Text style={styles.vibesTitle}>Rate Vibes:</Text>
            <ScrollView style={styles.scrollView}>
              {vibesList.map((vibe) => (
                <View key={vibe.key} style={styles.vibeRatingContainer}>
                  <Text style={styles.vibeText}>{vibe.name}</Text>
                  <Picker
                    selectedValue={selectedRatings[vibe.key]}
                    style={styles.picker}
                    onValueChange={(itemValue) =>
                      handleRatingChange(vibe.key, itemValue)
                    }
                  >
                    <Picker.Item label="0" value={0} />
                    <Picker.Item label="1" value={1} />
                    <Picker.Item label="2" value={2} />
                    <Picker.Item label="3" value={3} />
                    <Picker.Item label="4" value={4} />
                    <Picker.Item label="5" value={5} />
                  </Picker>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={styles.btnBox}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitReview}
            >
              <Text style={styles.submitText}>Submit Review</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "80%",
    height: "80%",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalTitleName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: primary,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: "100%",
  },
  vibesContainer: {
    width: "100%",
    marginBottom: 20,
  },
  scrollView: {
    maxHeight: 200,
  },
  vibesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  vibeRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  vibeText: {
    fontSize: 16,
    marginRight: 10,
    flex: 1,
  },
  picker: {
    width: 100,
  },
  btnBox: {
    width: "100%",
  },
  submitButton: {
    backgroundColor: primary,
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: lightGrey,
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  backText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ReviewModal;
