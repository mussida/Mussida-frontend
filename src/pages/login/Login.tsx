import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { View, Image } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSpotifyLogin } from "../../hooks/useSpotifyLogin";
import { fontVariant } from "../../utils/fonts/fontVariant";
export default function Login() {
	const { login } = useSpotifyLogin();
	const navigation = useNavigation();
	const theme = useTheme();

	return (
		<SafeAreaView
			style={{
				height: "100%",
				width: "100%",
				alignItems: "center",
				paddingHorizontal: 20,
			}}
		>
			<Image
				style={{ height: 80, resizeMode: "contain" }}
				source={require("./assets/logoColoredTransparent.png")}
			/>
			<Text
				children="Mussida"
				variant="displayLarge"
				style={{
					paddingTop: 8,
					fontFamily: fontVariant.bold,
				}}
			/>
			<Text
				style={{ textAlign: "center" }}
				children="Share your music taste with your friends"
				variant="titleLarge"
			/>
			<View
				style={{
					flexGrow: 1,
					paddingTop: 200,
					justifyContent: "center",
				}}
			>
				<Button
					mode="contained"
					contentStyle={{
						width: "100%",
					}}
					labelStyle={{
						fontSize: 18,
						lineHeight: 24,
						justifyContent: "center",
						alignItems: "center",
					}}
					children="Login"
					onPress={() => {
						login();
					}}
				/>
			</View>
			<Image
				style={{
					position: "absolute",
					left: "50%",
					bottom: -10,
					zIndex: -1,
				}}
				source={require("./assets/guitarMan.png")}
			/>
		</SafeAreaView>
	);
}
