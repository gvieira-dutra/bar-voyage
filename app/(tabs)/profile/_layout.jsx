import React from "react";
import { Stack } from "expo-router";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

export default function ProfileLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
        headerTintColor: Colors[colorScheme ?? "light"].text,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Profile" }} />
    </Stack>
  );
}
