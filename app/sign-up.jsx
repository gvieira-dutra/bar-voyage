import { primary, secondary, tintColorLight } from "@/constants/ThemeVariables";
import { Stack, router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  backgroundColor,
  darkGrey,
  lightGrey,
  placeholderTextColor,
} from "../constants/ThemeVariables";
import { auth } from "../firebaseConfig"; // Import the auth object from firebase

export default function SignUp() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isAdult, setIsAdult] = useState(false); // Add state for checkbox

  function handleSignUp() {
    if (!isAdult) {
      setMessage("You must be 18+ years to create an account.");
      return;
    }

    // Create user with email and password
    createUserWithEmailAndPassword(auth, mail, password)
      .then((userCredential) => {
        // User Created and signed in
        const user = userCredential.user; // User
        console.log("Signed in as", user.email);
        router.replace("/"); // Redirect to home
      })
      .catch((error) => {
        // Handle errors
        let errorMessage = error.code.split("/")[1];
        errorMessage = errorMessage.replaceAll("-", " ");
        setMessage(errorMessage);
      });
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Create new account",
          headerTintColor: tintColorLight,
          headerStyle: {
            backgroundColor: primary,
          },
        }}
      />
      <Text style={styles.appTitle}>BarVoyage</Text>

      <Text style={styles.label}>Mail</Text>
      <TextInput
        style={styles.input}
        onChangeText={setMail}
        value={mail}
        placeholder="Type your mail"
        placeholderTextColor={placeholderTextColor}
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <Text style={styles.label}>Password</Text>
        <Text style={styles.minChar}>Must be at least 6 characters.</Text>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        placeholder="Type your password"
        placeholderTextColor={placeholderTextColor}
      />

      {/* Add Checkbox */}
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setIsAdult(!isAdult)}
        >
          {isAdult && <View style={styles.checked} />}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>I am 18+ years</Text>
      </View>

      <Text style={styles.errorMessage}>{message}</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: backgroundColor,
  },
  main: {
    flex: 1,
  },
  image: {
    aspectRatio: 1,
  },
  label: {
    fontSize: 18,
    color: primary,
    marginTop: 30,
    marginBottom: 5,
    fontWeight: "bold",
  },
  minChar: {
    fontSize: 14,
    color: darkGrey,
    marginLeft: 10,
    marginTop: 32,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    height: 50,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: primary,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: primary,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checked: {
    width: 14,
    height: 14,
    backgroundColor: primary,
  },
  checkboxLabel: {
    fontSize: 16,
    color: primary,
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 70,
    color: primary,
  },
  button: {
    backgroundColor: primary, // Change color as needed
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white", // Change color as needed
    fontSize: 16,
    fontWeight: "bold",
  },
});
