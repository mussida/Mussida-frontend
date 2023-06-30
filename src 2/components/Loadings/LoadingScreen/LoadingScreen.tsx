import * as React from "react";

import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoadingScreen() {
	return (
		<SafeAreaView
			style={{
				padding: 24,
				alignItems: "center",
				justifyContent: "center",
				height: "100%",
			}}
		>
			{/* <View
        style={{
          height: "90%",
          width: "100%",
          backgroundColor: "black",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          padding: 16,
        }}
      > */}
			<LottieView
				autoPlay
				loop={true}
				source={require("../assets/89662-music.json")}
			/>
			{/* </View> */}
		</SafeAreaView>
	);
}
