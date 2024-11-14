import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { primary } from "@/constants/ThemeVariables";

export default function FilterButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.buttonContent}>
        <FontAwesome
          name="filter"
          size={24}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.text}>Filters</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: "flex-end",
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 5,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
