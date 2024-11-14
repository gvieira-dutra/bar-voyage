import {
  borderRadius,
  labelFontSize,
  placeholderTextColor,
  primary,
  secondary,
  tintColorLight,
} from "@/constants/ThemeVariables";
import { auth } from "@/firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { Stack, router } from "expo-router";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { backgroundColor } from "../../../constants/ThemeVariables";

export default function Profile() {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [image, setImage] = useState("");
  const [biography, setBiography] = useState("");

  // url to fetch (get and put) user data from Firebase Realtime Database
  const url = `https://bar-voyage-4a471-default-rtdb.europe-west1.firebasedatabase.app/users/${auth.currentUser?.uid}.json`;

  useEffect(() => {
    setMail(auth.currentUser.email); // set mail to the current user email
    getUser(); // fetch user data from Firebase Realtime Database
  }, []);

  async function getUser() {
    const response = await fetch(url);
    const userData = await response.json();

    if (userData) {
      // if userData exists set states with values from userData (data from Firebase Realtime Database)
      setName(userData?.name); // set name to the value of the name property from userData
      setImage(userData?.image); // set image to the value of the image property from userData
      setBiography(userData?.biography);
    }
  }

  // sign out the user and redirect to the sign-in screen
  async function handleSignOut() {
    await signOut(auth);
    router.replace("/sign-in");
  }

  // choose an image from the device gallery
  async function chooseImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
      allowsEditing: true,
      quality: 0.3,
    });

    // if the user didn't cancel the image picker, set the image state with the base64 image
    if (!result.canceled) {
      const base64 = "data:image/jpeg;base64," + result.assets[0].base64;
      setImage(base64);
    }
  }

  async function handleSaveUser() {
    const userToUpdate = { name: name, mail: mail, image, biography }; // create an object to hold the user to update properties

    // send a PUT request to update user data in Firebase Realtime Database
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(userToUpdate),
    });
    // if the response is ok, log the user data
    if (response.ok) {
      const data = await response.json();
      console.log("User data: ", data);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      automaticallyAdjustKeyboardInsets={true}
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <Button
              title="Sign Out"
              color={Platform.OS === "ios" ? "gray" : primary}
              onPress={handleSignOut}
            />
          ),
        }}
      />
      <View>
        <TouchableOpacity onPress={chooseImage} style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{
              uri:
                image ||
                "https://cederdorff.com/race/images/placeholder-image.webp",
            }}
          />
        </TouchableOpacity>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder="Type your name"
          placeholderTextColor={placeholderTextColor}
          autoCapitalize="none"
        />
        <Text style={styles.label}>Biography</Text>
        <TextInput
          style={styles.bioInput}
          onChangeText={setBiography}
          value={biography}
          placeholder="Type your biography"
          placeholderTextColor={placeholderTextColor}
          autoCapitalize="none"
          multiline={true}
          numberOfLines={4}
        />
        <Text style={styles.label}>Mail</Text>
        <TextInput
          style={styles.input}
          onChangeText={setMail}
          value={mail}
          placeholder="Type your mail"
          placeholderTextColor={placeholderTextColor}
          autoCapitalize="none"
          editable={false}
          backgroundColor="#dddddd"
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSaveUser}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: backgroundColor,
  },
  label: {
    fontSize: labelFontSize,
    color: primary,
    marginTop: 20,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    padding: 10,
    borderWidth: 2,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: primary,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: primary,
  },
  buttonContainer: {
    marginBottom: 50,
    marginTop: 20,
  },
  bioInput: {
    height: 100,
    padding: 10,
    borderWidth: 2,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: primary,
  },
  button: {
    backgroundColor: primary,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
