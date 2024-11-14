import React from "react";
import { Text, View, StyleSheet } from "react-native";

const StarRating = ({ rating, style }) => {
  let stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Text key={i} style={[style]}>
        {i <= rating ? "★" : "☆"}
      </Text>
    );
  }
  return <View style={{ flexDirection: "row" ,}}>{stars}</View>;
};

export default StarRating;
