import { StatusBar } from "expo-status-bar";
import {
  Button,
  Platform,
  StyleSheet,
  Image,
  View,
  Text,
  Stat,
  Clipboard,
} from "react-native";
import StarRating from "@/components/StarRating";
import LikeButton from "@/components/LikeButton";
import ShareButton from "@/components/ShareButton";
import { useState, useEffect } from "react";

const mockPlaceInfo = {
  imageSrc: require("../assets/images/bar-Image.jpg"),
  reviews: {
    averageRating: 4.5, // Example rating
  },
  categories: [
    { name: "Category 1", rating: 4 },
    { name: "Category 2", rating: 5 },

    // Add more categories as needed
  ],
  description: "This is a mock description for the place.",
};

export default function ModalScreen() {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikePress = () => {
    setIsLiked(!isLiked);
  };

  const handleSharePress = () => {
    Clipboard.setString("https://wwww.google.com");
    alert("Link copied to clipboard!");
  };

  return (
    <View style={styles.container}>
      <Image source={mockPlaceInfo.imageSrc} style={styles.image} />

      <StarRating
        style={styles.star}
        rating={mockPlaceInfo.reviews.averageRating}
      />
      <View style={styles.buttonContainer}>
        <LikeButton isLiked={isLiked} onPress={handleLikePress} />
        <ShareButton onShare={handleSharePress} />
      </View>
      {mockPlaceInfo.categories.map((category, index) => (
        <View key={index} style={styles.categoryContainer}>
          <Text style={styles.title}>{category.name}</Text>
          <StarRating style={styles.star} rating={category.rating} />
        </View>
      ))}
      <Text style={styles.description}>{mockPlaceInfo.description}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
  },
  image: {
    borderRadius: 10,
    width: 300,
    height: 200,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    margin: 10,
    width: "100%",
    justifyContent: "space-around",
  },
  categoryContainer: {
    alignItems: "center",
    margin: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    textAlign: "center",
    margin: 10,
  },
  star: {
    marginHorizontal: 2,
    fontSize: 20,
    color: "#FFD700",
  },
});
