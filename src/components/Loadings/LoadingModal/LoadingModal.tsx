import * as React from "react";
import {
  Modal,
  Portal,
  Text,
  Button,
  Provider,
  useTheme,
} from "react-native-paper";

import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

export default function LoadingModal({ visible }: { visible: boolean }) {
  const theme = useTheme();
  return (
    <Portal>
      <Modal visible={visible}>
        <SafeAreaView
          style={{
            padding: 24,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              height: "90%",
              width: "100%",
              backgroundColor: "black",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <LottieView
              autoPlay
              loop={true}
              source={require("../assets/89662-music.json")}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </Portal>
  );
}
