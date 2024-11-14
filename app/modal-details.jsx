import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  Animated,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import StarRating from "@/components/StarRating";
import LikeButton from "@/components/LikeButton";
import ShareButton from "@/components/ShareButton";
import { useLocalSearchParams, router, Stack } from "expo-router"; // Import the router
import * as Clipboard from "expo-clipboard";
import { ref, get, update, remove } from "firebase/database";
import { auth, database } from "../firebaseConfig"; // Make sure the path is correct
import { primary } from "@/constants/ThemeVariables";
import { useFocusEffect } from "@react-navigation/native";

const ModalScreen = () => {
  const [barInfo, setBarInfo] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current; // Initial scale value
  const { selectedBarId } = useLocalSearchParams();

  const getBarInfo = async () => {
    try {
      const barRef = ref(database, `bars/${selectedBarId}`);
      const snapshot = await get(barRef);
      if (snapshot.exists()) {
        setBarInfo({
          id: selectedBarId,
          ...snapshot.val(),
        });
      } else {
        throw new Error("Bar not found");
      }
    } catch (error) {
      console.error("Error fetching bar information:", error.message);
    }
  };

  const getUserFavorites = async () => {
    try {
      const userId = auth.currentUser.uid;
      const userFavoritesRef = ref(database, `users/${userId}/favoriteBars`);
      const snapshot = await get(userFavoritesRef);
      if (snapshot.exists()) {
        const favorites = snapshot.val();
        setIsFavorite(favorites[selectedBarId]?.isFavorite || false);
      } else {
        setIsFavorite(false);
      }
    } catch (error) {
      console.error("Error fetching user favorites:", error.message);
    }
  };

  const updateFavoriteInDatabase = async (barId, isFavorite) => {
    try {
      const userId = auth.currentUser.uid;
      const userFavoritesRef = ref(
        database,
        `users/${userId}/favoriteBars/${barId}`
      );

      // Update the user's favorite status for the specific bar
      if (isFavorite) {
        // Add to user's favorites
        await update(userFavoritesRef, { isFavorite: true });
      } else {
        // Remove from user's favorites
        await remove(userFavoritesRef);
      }

      // Update local state to reflect the change in 'isFavorite'
      setIsFavorite(isFavorite);
    } catch (error) {
      console.error("Error updating favorite status:", error.message);
    }
  };

  const handleLikePress = async () => {
    try {
      const newIsFavorite = !isFavorite;
      await updateFavoriteInDatabase(barInfo.id, newIsFavorite);

      if (newIsFavorite) {
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.5,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      }
    } catch (error) {
      console.error("Error handling like press:", error.message);
    }
  };

  const handleSharePress = async () => {
    try {
      await Clipboard.setStringAsync("https://www.google.com");
    } catch (error) {
      console.error("Error handling share press:", error.message);
    }
  };

  const handleLinkPress = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error(`Don't know how to open this URL: ${url}`);
      }
    } catch (error) {
      console.error("Error handling link press:", error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getBarInfo();
      getUserFavorites();
    }, [selectedBarId])
  );

  if (!barInfo) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  const overallRating = (
    barInfo.overallReviews.totalVotes / barInfo.overallReviews.numberOfVotes
  ).toFixed(1);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Stack.Screen
        options={{
          title: `${barInfo.name}`,
          headerBackTitleVisible: false,
        }}
      />
      <View style={styles.container}>
        <Image source={{ uri: barInfo.picture }} style={styles.image} />
        <Text style={styles.title}>
          <Text>{barInfo.name}</Text>{" "}
          <Text style={styles.overallRating}>{overallRating}/5</Text>
        </Text>
        <Text style={styles.description}>
          {barInfo.address.country}, {barInfo.address.city},{" "}
          {barInfo.address.streetName}, {barInfo.address.streetNumber}
        </Text>
        <View style={styles.buttonContainer}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <LikeButton isLiked={isFavorite} onPress={handleLikePress} />
          </Animated.View>
          <ShareButton onShare={handleSharePress} />
        </View>
        <View style={styles.categoryContainer}>
          {Object.keys(barInfo.vibe).map((key) => {
            const value = barInfo.vibe[key];
            if (typeof value === "object" && value !== null) {
              return (
                <View key={key} style={styles.vibeContainer}>
                  <Text style={styles.vibeText}>{key}</Text>
                  <StarRating
                    rating={value.totalVotes / value.numberOfVotes}
                    style={styles.star}
                  />
                  <Text style={styles.vibeVotes}>
                    Number of Votes: {value.numberOfVotes}
                  </Text>
                </View>
              );
            } else {
              return (
                <Text style={styles.vibeText} key={key}>
                  {key}: {value}
                </Text>
              );
            }
          })}
        </View>
        <Text style={styles.description}>{barInfo.description}</Text>
        {barInfo.socialMedia && (
          <View style={styles.socialMediaContainer}>
            {barInfo.socialMedia.facebook && (
              <TouchableOpacity
                onPress={() => handleLinkPress(barInfo.socialMedia.facebook)}
              >
                <Text style={styles.linkText}>Facebook</Text>
              </TouchableOpacity>
            )}
            {barInfo.socialMedia.instagram && (
              <TouchableOpacity
                onPress={() => handleLinkPress(barInfo.socialMedia.instagram)}
              >
                <Text style={styles.linkText}>Instagram</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <TouchableOpacity
          style={styles.addReviewButton}
          onPress={() =>
            router.push({
              pathname: "/modal-review",
              params: { id: selectedBarId },
            })
          }
        >
          <Text style={styles.addReviewText}>Add Review</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
    width: "100%",
  },
  image: {
    borderRadius: 10,
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    margin: 10,
    width: "100%",
    justifyContent: "space-around",
  },
  categoryContainer: {
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  overallRating: {
    fontSize: 15,
    color: "#777",
  },
  description: {
    textAlign: "center",
    margin: 10,
    fontSize: 16,
    color: "#666",
  },
  star: {
    marginHorizontal: 2,
    fontSize: 20,
    color: "#FFD700",
  },
  vibeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-around",
  },
  vibeText: {
    fontSize: 18,
    color: "#555",
    marginRight: 10,
  },
  vibeVotes: {
    fontSize: 16,
    color: "#777",
  },
  socialMediaContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  linkText: {
    fontSize: 18,
    color: "#1e90ff",
    textDecorationLine: "underline",
    marginHorizontal: 10,
  },
  addReviewButton: {
    backgroundColor: primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  addReviewText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ModalScreen;
