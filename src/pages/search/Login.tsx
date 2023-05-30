import { QueryClient } from "@tanstack/react-query";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";
import { useSpotifyLogin } from "../../hooks/useSpotifyLogin";
import { useTheme } from "react-native-paper";

export default function Login() {
  const { login } = useSpotifyLogin();
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          contentStyle={styles.button}
          children="Login"
          onPress={() => {
            login();
          }}
        />
        <Button
          children="Search your track"
          onPress={() => navigation.navigate("SearchPage")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
  },
  button: {},
  buttonContainer: {
    marginTop: "80%",
  },
});
