import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
} from "react-native";
import {
  backgroundColor,
  placeholderTextColor,
  primary,
  secondary,
  tintColorLight,
} from "../constants/ThemeVariables";
import { auth } from "../firebaseConfig";
import { Stack, router } from "expo-router";

export default function SignIn() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSignIn() {
    // Sign in with email and password
    signInWithEmailAndPassword(auth, mail, password)
      .then((userCredential) => {
        // User is signed in
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

  function goToSignUp() {
    router.push("/sign-up"); // Redirect to sign up
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Sign In",
          headerShown: false,
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
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        placeholder="Type your password"
        placeholderTextColor={placeholderTextColor}
      />
      <Text style={styles.errorMessage}>{message}</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <View style={styles.separatorContainer}>
        <View style={styles.separator} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.separator} />
      </View>
      <TouchableOpacity style={styles.secondaryButton} onPress={goToSignUp}>
        <Text style={styles.secondaryButtonText}>Create New Account</Text>
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
  label: {
    fontSize: 18, // Adjust as needed
    color: primary,
    marginTop: 30,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: primary,
    borderWidth: 2,
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
    marginTop: 150,
    color: primary,
  },
  button: {
    backgroundColor: primary,
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: "black",
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "black",
  },
  secondaryButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryButtonText: {
    color: "gray",
    fontSize: 16,
  },
});
