import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import "react-native-gesture-handler";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

import {
	NunitoSans_400Regular,
	NunitoSans_700Bold,
	useFonts,
} from "@expo-google-fonts/nunito-sans";
import * as React from "react";
import { LogBox, StatusBar, StyleSheet } from "react-native";
import { MD3DarkTheme, Provider, configureFonts } from "react-native-paper";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import GlobalConfirmationDialog from "./src/components/GlobalConfirmationDialog/GlobalConfirmationDialog";
import { GlobalConfirmationDialogProvider } from "./src/components/GlobalConfirmationDialog/controller/GlobalConfirmationDialogProvider";
import CreatePost from "./src/pages/CreatePost/CreatePost";
import RootPage from "./src/pages/RootPage/RootPage";
import Login from "./src/pages/login/Login";
import { spotifyTokenAtom } from "./src/utils/atoms/tokenAtoms";
import Top10Artists from "./src/pages/Profile/Pages/top10artists/Top10Artists";
import Top10Songs from "./src/pages/Profile/Pages/top10Songs/Top10Songs";
import Top5Playlists from "./src/pages/Profile/Pages/top5Playlists/Top5Playlist";

LogBox.ignoreAllLogs();

// Create a client
const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();

export default function App() {
	const [fontsLoaded] = useFonts({
		NunitoSans_400Regular,
		NunitoSans_700Bold,
	});

	const token = useAtomValue(spotifyTokenAtom);

	React.useEffect(() => {
		StatusBar.setBarStyle("light-content");
	}, []);

	if (!fontsLoaded) {
		return null;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<Provider
				theme={{
					...MD3DarkTheme,
					fonts: configureFonts({
						config: {
							fontFamily: "NunitoSans_400Regular",
						},
					}),
				}}
			>
				<GestureHandlerRootView
					style={{ width: "100%", height: "100%" }}
				>
					<GlobalConfirmationDialogProvider>
						<NavigationContainer theme={DarkTheme}>
							<BottomSheetModalProvider>
								<Stack.Navigator>
									{token == null ? (
										<Stack.Screen
											options={{
												header: () => null,
											}}
											name="Home"
											component={Login}
										/>
									) : (
										<>
											<Stack.Screen
												name="RootPage"
												component={RootPage}
												options={{
													header: () => null,
												}}
											/>
											<Stack.Screen
												name="CreatePost"
												options={{
													title: "Create post",
												}}
												component={CreatePost}
											/>
											<Stack.Screen
												name="Top10Artists"
												component={Top10Artists}
												options={{
													title: "Top 10 artists",
												}}
											/>
											<Stack.Screen
												name="Top10Songs"
												component={Top10Songs}
												options={{
													title: "Top 10 songs",
												}}
											/>
											<Stack.Screen
												name="Top5Playlists"
												component={Top5Playlists}
												options={{
													title: "Top 5 playlists",
												}}
											/>
										</>
									)}
								</Stack.Navigator>
							</BottomSheetModalProvider>
						</NavigationContainer>
						<GlobalConfirmationDialog />
					</GlobalConfirmationDialogProvider>
				</GestureHandlerRootView>
				<Toast />
			</Provider>
		</QueryClientProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
});
