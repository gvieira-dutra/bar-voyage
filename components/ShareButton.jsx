import React from "react";
import { TouchableOpacity, Share, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const ShareButton = ({ onShare }) => (
  <TouchableOpacity style={styles.button} onPress={onShare}>
    <AntDesign name="sharealt" size={24} color="black" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    // Styles for your button
  },
});

export default ShareButton;
