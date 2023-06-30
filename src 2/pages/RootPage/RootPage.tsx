import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { useTheme } from "react-native-paper";
import Home from "../Home/Home";
import Profile from "../Profile/Profile";

const Tab = createBottomTabNavigator();

export default function RootPage() {
	const theme = useTheme();
	return (
		<Tab.Navigator
			screenOptions={({ route }) => {
				return {
					tabBarIcon: ({ focused, color, size }) => {
						let iconName;
						if (route.name === "Home") {
							iconName = "home";
						} else if (route.name === "Post") {
							iconName = "comment-plus";
						} else if (route.name === "Profile") {
							iconName = "face-man-profile";
						}

						// You can return any component that you like here!
						return (
							<MaterialCommunityIcons
								//@ts-ignore
								name={iconName}
								size={size}
								color={color}
							/>
						);
					},
					tabBarActiveTintColor: theme.colors.primary,
					tabBarInactiveTintColor: "gray",
					// title: "",
					headerTitle: "",
				};
			}}
		>
			<Tab.Screen name="Home" component={Home} />
			{/* <Tab.Screen name="Post" component={Post} /> */}
			<Tab.Screen name="Profile" component={Profile} />
		</Tab.Navigator>
	);
}
