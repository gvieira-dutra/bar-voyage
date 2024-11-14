import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const LikeButton = ({ isLiked, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <AntDesign name={isLiked ? "heart" : "hearto"} size={24} color="red" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // Styles for your button
  },
});

export default LikeButton;
