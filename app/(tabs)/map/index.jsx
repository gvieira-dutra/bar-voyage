import React, { useState, useEffect, useRef } from "react";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { primary } from "@/constants/ThemeVariables";

const { width, height } = Dimensions.get("window");

import MapView, { Callout, Marker } from "react-native-maps";
import * as Location from "expo-location";
import Slider from "@react-native-community/slider";
import { getDatabase, ref, onValue, get } from "firebase/database";
import { router } from "expo-router";

export default function TabTwoScreen() {
  const [location, setLocation] = useState({
    latitude: 50.6682012,
    longitude: 4.6128839,
  });
  const [region, setRegion] = useState({
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [myLocation, setmyLocation] = useState(null);
  const [cityName, setCityName] = useState("Louvain-la-Neuve");
  const [country, setCountry] = useState("Belgium");
  const [cityInRadius, setCityInRadius] = useState([]);
  const [radius, setRadius] = useState(30);
  const [barsData, setBarsData] = useState([]);
  const [bars, setBars] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  function calculerDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Rayon de la Terre en km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance en km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const fetchBars = () => {
    const db = getDatabase();
    const barsRef = ref(db, "bars");

    get(barsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setBarsData(data);
        } else {
          console.log("Aucune donnée disponible");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  };

  function villesDansRayon(location, rayon) {
    if (!barsData) {
      console.log("barsData est vide ou non défini");
      return;
    }

    const barsArray = Object.keys(barsData).map((key) => ({
      ...barsData[key],
      latitude: barsData[key].location.lat,
      longitude: barsData[key].location.lon,
    }));

    const blabla = barsArray.filter((bar) => {
      let distance = calculerDistance(
        location.latitude,
        location.longitude,
        bar.location.lat,
        bar.location.lon
      );
      //return distance <= rayon;
      return distance <= rayon;
    });

    // Mise à jour de l'état avec tous les bars dans le rayon en une seule opération
    setCityInRadius(blabla);
  }
  async function getBars() {
    setRefreshing(true); // Start refreshing animation
    const response = await fetch(
      "https://bar-voyage-4a471-default-rtdb.europe-west1.firebasedatabase.app/bars.json"
    );
    const data = await response.json();
    const arrayOfBars = Object.keys(data).map((key) => {
      return {
        id: key,
        ...data[key],
      };
    });
    setBars(arrayOfBars);
  }

  const fetchCityData = async () => {
    try {
      console.log("fetching data for : ", cityName, "country : ", country);
      const response = await fetch(
        `https://api.api-ninjas.com/v1/geocoding?city=${cityName}&country=${country}`,

        {
          method: "GET",
          headers: {
            "X-Api-Key": "QZ2s4vD9a9igD/xja3Q1FQ==xgkKqgn6jWfRBpYW",
          },
        }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { latitude, longitude } = data[0];
        setLocation({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else {
        Alert.alert("Error", "City Not Found");
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erreur",
        "Une erreur s'est produite lors de la récupération des données de la ville."
      );
    }
  };

  useEffect(() => {
    setRegion({
      ...region,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  }, [location]);
  useEffect(() => {
    getBars();
  }, []);
  useEffect(() => {
    villesDansRayon(location, radius);
  }, []);
  useEffect(() => {
    async function requestLocalPermissions() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      if (location.latitude == null && location.longitude == null) {
        setLocation({
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
          latitudeDelta: 0.15,
          longitudeDelta: 0.04,
        });
      }
    }
    requestLocalPermissions();
    fetchBars();
    villesDansRayon(location, radius);
  }, [radius]);

  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      // Animer la carte pour se centrer sur la nouvelle région
      mapRef.current.animateToRegion(region, 1000); // 1000 ms pour l'animation
    }
  }, [region]); // Se déclenche chaque fois que la région change

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.Bigcontainer}>
      <View style={styles.inputContainer}>
        <View style={styles.inputContainerInside}>
          <TextInput
            style={styles.inputText}
            placeholder="City"
            value={cityName}
            onChangeText={setCityName}
          />
          <TextInput
            style={styles.inputText}
            placeholder="Country"
            value={country}
            onChangeText={setCountry}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={fetchCityData}>
          <Text style={styles.text}>Change City</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.bars}>
          <Slider
            style={{
              width: "85%",
              justifyContent: "center",
              alignSelf: "center",
              color: primary,
              borderRadius: 20,
            }}
            minimumTrackTintColor={primary}
            maximumTrackTintColor="white"
            thumbTintColor={primary}
            minimumValue={0}
            maximumValue={100}
            value={30}
            onValueChange={setRadius}
          />
          <Text style={{ fontSize: 12, textAlign: "center" }}>
            {radius.toFixed(1)} km
          </Text>
        </View>
        <MapView ref={mapRef} style={styles.map} initialRegion={region}>
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="You are here"
              pinColor="blue"
            />
          )}
          {cityInRadius.map((place, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
              title={place.name}
              style={styles.calloutTitle}
            >
              <Callout>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/modal-details",
                        params: { selectedBarId: place.id },
                      })
                    }
                  >
                    <Text style={styles.calloutTitle}>{place.name}</Text>
                    <Text style={styles.description}>{place.description}</Text>
                    <Image
                      source={{
                        uri: place.picture || "https://via.placeholder.com/150",
                      }}
                      style={styles.image}
                    />
                  </TouchableOpacity>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  map: {
    alignSelf: "flex-end",
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  Bigcontainer: {
    flex: 1,
  },
  inputContainer: {

    backgroundColor: "lightBlue",
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    padding: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  inputContainerInside: {
    height: 70,
    flex: 1, 

    display: "flex",
    flexDirection: "row",
    backgroundColor: "lightBlue",
    border: "1px solid black",
    marginBottom: 30,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    alignItems: "center",
  },
  inputText: {
    flex: 1, 
    backgroundColor: "lightBlue",
    padding: 10, 
    borderBottomWidth: 2,
    borderBottomColor: primary,
    marginRight: 10, 
  },
  button: {
    backgroundColor: primary,
    paddingVertical: 10, 
    paddingHorizontal: 15, 
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center", 
  },
  image: {
    width: width * 0.8,
    height: 120,
    borderRadius: 8,
    alignSelf: "center",
  },
  bars: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    flexWrap: "wrap",
    borderRadius: "20%",
    alignItems: "center",
    width: width,
  },
  calloutTitle: {
    color: primary,
    fontWeight: "bold",
  },
  description: {
    flexShrink: 1,
    marginBottom: 10,
    color: "#333",
    fontSize: 14,
    widht: "100%",
    maxWidth: width * 0.8,
  },
});
