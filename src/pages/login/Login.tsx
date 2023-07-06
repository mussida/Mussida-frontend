import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { Image, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useConfirmationDialog } from "../../components/GlobalConfirmationDialog/hooks/useConfirmationDialog";
import { useSpotifyLogin } from "../../hooks/useSpotifyLogin";

export default function Login() {
	const { login } = useSpotifyLogin();
	const [hasAcceptedEula, setHasAcceptedEula] = React.useState(false);
	const { showConfirmationDialog } = useConfirmationDialog();

	const showEulaModal = () => {
		showConfirmationDialog({
			title: "Accept EULA",
			description: `End-User License Agreement

Updated at 2023-07-05
			
			
Mussida hereby grants you access to Mussida and invites you to purchase the services offered here.
			
			
Definitions and key terms
			
To help explain things as clearly as possible in this Eula, every time any of these terms are referenced, are strictly defined as:
			
-Cookie: small amount of data generated by a website and saved by your web browser. It is used to identify your browser, provide analytics, remember information about you such`,
			negativeButton: {
				text: "Decline",
				onPress: () => {},
			},
			positiveButton: {
				text: "Accept",
				onPress: () => {
					setHasAcceptedEula(true);
					login();
					return AsyncStorage.setItem("hasAcceptedEula", "true");
				},
			},
		});
	};

	React.useEffect(() => {
		AsyncStorage.getItem("hasAcceptedEula")
			.then((value) => {
				if (value === null || value === "false") {
					showEulaModal();
				} else {
					setHasAcceptedEula(true);
				}
			})
			.catch((err) => {});
	}, []);

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
				style={{ height: 120, resizeMode: "contain", marginTop: 100 }}
				source={require("./assets/logoColoredTransparent.png")}
			/>
			{/* <Text
				children="Mussida"
				variant="displayLarge"
				style={{
					paddingTop: 8,
					fontFamily: fontVariant.bold,
				}}
			/> */}
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
						if (hasAcceptedEula) {
							login();
						} else {
							showEulaModal();
						}
					}}
				/>
			</View>
			{/* <Image
				style={{
					position: "absolute",
					left: "50%",
					bottom: -10,
					zIndex: -1,
				}}
				source={require("./assets/guitarMan.png")}
			/> */}
		</SafeAreaView>
	);
}
