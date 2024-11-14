import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, ScrollView } from "react-native";
import BarCard from "@/components/BarCard";
import FilterButton from "@/components/FilterButton";
import FilterModal from "@/components/FilterModal";

export default function TabOneScreen() {
  const [bars, setBars] = useState([]);
  const [sortedBars, setSortedBars] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState("default");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getBars();
  }, []);

  async function getBars() {
    setRefreshing(true); // Start refreshing animation
    const response = await fetch(
      "https://bar-voyage-4a471-default-rtdb.europe-west1.firebasedatabase.app/bars.json"
    );
    const data = await response.json();
    const arrayOfBars = Object.keys(data).map((key) => {
      return {
        id: key,
        ...data[key],
      };
    });
    setBars(arrayOfBars);
    setSortedBars(arrayOfBars);
    setRefreshing(false); // Stop refreshing animation
  }

  function renderBar({ item }) {
    return <BarCard bar={item} />;
  }

  const handleFilterPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleApplyFilter = () => {
    if (sortOption === "alphabetical") {
      const sorted = [...bars].sort((a, b) => a.name.localeCompare(b.name));
      setSortedBars(sorted);
    } else if (sortOption === "ranking") {
      const sorted = [...bars].sort((a, b) => {
        const ratingA =
          a.overallReviews.totalVotes > 0
            ? a.overallReviews.numberOfVotes / a.overallReviews.totalVotes
            : 0;
        const ratingB =
          b.overallReviews.totalVotes > 0
            ? b.overallReviews.numberOfVotes / b.overallReviews.totalVotes
            : 0;
        return ratingA - ratingB;
      });
      setSortedBars(sorted);
    } else {
      setSortedBars([...bars]);
    }
    setModalVisible(false);
  };

  const handleSort = (option) => {
    setSortOption(option);
  };

  return (
    <View contentContainerStyle={styles.container}>
      <FilterButton onPress={handleFilterPress} />
      <FlatList
        data={sortedBars}
        renderItem={renderBar}
        keyExtractor={(item) => item.id}
        style={styles.barList}
      />
      <FilterModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onApply={handleApplyFilter}
        onSort={handleSort}
        defaultSort={sortOption}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  barList: {
    width: "100%",
    marginBottom: 60,
  },
});
