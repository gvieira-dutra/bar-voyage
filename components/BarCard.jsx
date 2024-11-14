import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { primary } from "@/constants/ThemeVariables";

const { width } = Dimensions.get("window");

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export default function BarCard({ bar }) {
  const navigation = useNavigation(); // Access navigation prop

  function handlePress() {
    // Open the modal file
    // navigation.navigate("Modal", { file: bar.modalFile });
    router.push({
      pathname: "/modal-details",
      params: { selectedBarId: bar.id },
    });
  }

  const totalVotes = bar.overallReviews.totalVotes || 0;
  const numberOfVotes = bar.overallReviews.numberOfVotes || 1; // Prevent division by zero
  const rating = (totalVotes / numberOfVotes).toFixed(1); // Round to one decimal place

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image
        source={{
          uri: bar.picture || "https://via.placeholder.com/150",
        }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{bar.name}</Text>
        <Text style={styles.description}>
          {truncateText(bar.description, 100)}{" "}
        </Text>
        <Text style={styles.rating}>Rating: {rating}/5</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginVertical: 10,
    marginHorizontal: 20,
    overflow: "hidden",
    height: 150,
    padding: 10,
  },
  image: {
    width: width / 3,
    height: 120,
    borderRadius: 8,
    alignSelf: "center",
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    // text color
    color: primary,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  rating: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
