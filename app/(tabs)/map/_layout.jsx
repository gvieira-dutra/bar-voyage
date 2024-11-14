import { Stack } from "expo-router";
//import { primary, tintColorLight } from "@/constants/ThemeVariables";

export default function MapLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "white",
          headerShown: "false",
        },
        headerTintColor: "black",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Map",
        }}
      />
    </Stack>
  );
}
