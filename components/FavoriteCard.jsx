import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { heartColor } from "../constants/ThemeVariables";
import { router } from "expo-router";

const BarCard = ({ bar, onToggleFavorite }) => {
  function showDetailModal() {
    router.push({
      pathname: "/modal-details",
      params: { selectedBarId: bar.id },
    });
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={showDetailModal} style={styles.touchable}>
        <Image source={{ uri: bar.picture }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{bar.name}</Text>
          <Text style={styles.address}>
            {bar.address.country}, {bar.address.city},{" "}
            {bar.address.streetNumber} {bar.address.streetName}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onToggleFavorite(bar.id)}
        style={styles.iconContainer}
      >
        <Icon
          name="heart"
          size={30}
          color={bar.isFavorite ? "red" : "gray"}
          style={styles.favouriteIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    margin: 4,
    padding: 10,
    alignItems: "center",
  },
  touchable: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  info: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  address: {
    fontSize: 14,
    color: "#777",
  },
  iconContainer: {
    padding: 10,
  },
  favouriteIcon: {
    marginLeft: 10,
  },
});

export default BarCard;
