import React, { useState, useCallback } from "react";
import {
  SectionList,
  StyleSheet,
  RefreshControl,
  View,
  Text,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import FavoriteCard from "@/components/FavoriteCard";
import { auth, database } from "@/firebaseConfig";
import { ref, get, update, remove } from "firebase/database";
import { useFocusEffect } from "@react-navigation/native";

export default function FavoriteScreen() {
  const [sections, setSections] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getBars();
    }, [])
  );

  async function getBars() {
    try {
      const userId = auth.currentUser.uid;
      const userFavoritesRef = ref(database, `users/${userId}/favoriteBars`);
      const snapshot = await get(userFavoritesRef);

      if (snapshot.exists()) {
        const favoriteBars = snapshot.val();
        const barPromises = Object.keys(favoriteBars).map(async (barId) => {
          const barRef = ref(database, `bars/${barId}`);
          const barSnapshot = await get(barRef);
          if (barSnapshot.exists()) {
            return {
              id: barId,
              ...barSnapshot.val(),
            };
          }
          return null;
        });

        const bars = (await Promise.all(barPromises)).filter(Boolean);

        // Group bars by city
        const groupBarsByCity = bars.reduce((acc, bar) => {
          const city = bar.address.city || "Others";
          if (!acc[city]) {
            acc[city] = { city, data: [] };
          }
          acc[city].data.push(bar);
          return acc;
        }, {});

        // Convert object to array for SectionList
        const sectionsArray = Object.values(groupBarsByCity);

        // Update state with grouped sections
        setSections(sectionsArray);
      } else {
        setSections([]);
      }
    } catch (error) {
      console.error("Error fetching user favorites:", error.message);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await getBars();
    setRefreshing(false);
  }

  const updateFavoriteInDatabase = async (barId, isFavorite) => {
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
  };

  const toggleFavorite = async (barId) => {
    setSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        data: section.data.map((bar) =>
          bar.id === barId ? { ...bar, isFavorite: !bar.isFavorite } : bar
        ),
      }))
    );

    const bar = sections
      .flatMap((section) => section.data)
      .find((bar) => bar.id === barId);
    if (bar) {
      const newIsFavorite = !bar.isFavorite;
      await updateFavoriteInDatabase(barId, newIsFavorite);
    }
  };

  const renderBar = ({ item }) => {
    return <FavoriteCard bar={item} onToggleFavorite={toggleFavorite} />;
  };

  const renderSectionHeader = ({ section: { city } }) => (
    <View style={styles.header}>
      <Text style={styles.headerText}>{city}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {sections.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="black"
            />
          }
        >
          <Text style={styles.noFavoritesText}>No favorites added</Text>
        </ScrollView>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(bar) => bar.id}
          renderItem={renderBar}
          renderSectionHeader={renderSectionHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="black"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reviewButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    margin: 10,
  },
  reviewButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  contentContainer: {
    padding: 10,
  },
  header: {
    padding: 10,
    backgroundColor: "#f4f4f4",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 8,
    height: 1,
    width: "100%",
    backgroundColor: "#CED0CE",
  },
  noFavoritesText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "grey",
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
