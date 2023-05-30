import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileHome from "./Pages/ProfileHome/ProfileHome";
import Top10Songs from "./Pages/top10Songs/Top10Songs";
import Top10Artists from "./Pages/top10artists/Top10Artists";
import Top5Playlists from "./Pages/top5Playlists/Top5Playlist";

export default function Profile() {
	const Stack = createNativeStackNavigator();
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="ProfileHome"
				component={ProfileHome}
				options={{
					header: () => null,
				}}
			/>
			<Stack.Screen
				name="Top10Artists"
				component={Top10Artists}
				options={{ title: "Top 10 artists" }}
			/>
			<Stack.Screen
				name="Top10Songs"
				component={Top10Songs}
				options={{ title: "Top 10 songs" }}
			/>
			<Stack.Screen
				name="Top5Playlists"
				component={Top5Playlists}
				options={{ title: "Top 5 playlists" }}
			/>
		</Stack.Navigator>
	);
}
