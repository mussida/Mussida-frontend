import { Platform, View } from "react-native";
import * as React from "react";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { FAB, Portal } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import useGetRecommendedPosts, {
	getRecommendPostsQueryKey,
} from "../../components/Post/Hooks/useGetRecommendedPosts";
import LoadingScreen from "../../components/Loadings/LoadingScreen/LoadingScreen";
import SinglePost from "../../components/Post/SinglePost";
import { FlatList } from "react-native-gesture-handler";
import { useQueryClient } from "@tanstack/react-query";
import { useExpoNotification } from "../../hooks/useRegisterForNotifications";

export default function Home() {
	const { bottom } = useSafeAreaInsets();

	const queryClient = useQueryClient();
	const navigation = useNavigation();
	const [open, setOpen] = React.useState(false);
	const { data, isLoading, isFetching } = useGetRecommendedPosts();

	useExpoNotification();

	if (isLoading) {
		return <LoadingScreen />;
	}
	return (
		<View
			style={{
				height: "100%",
				position: "relative",
			}}
		>
			<FlatList
				onRefresh={() => {
					queryClient.invalidateQueries(getRecommendPostsQueryKey);
				}}
				contentContainerStyle={{
					padding: 12,
				}}
				refreshing={isFetching}
				data={data?.data}
				renderItem={(item) => {
					return <SinglePost post={item.item} />;
				}}
			></FlatList>
			<FAB.Group
				open={open}
				visible
				style={{
					position: "absolute",
					bottom: Platform.OS === "android" ? bottom : -35,
					right: 0,
				}}
				icon={(iconProps) => {
					return open ? (
						<MaterialCommunityIcons name={"home"} {...iconProps} />
					) : (
						<AntDesign name="plus" {...iconProps} />
					);
				}}
				// backdropColor="transparent"
				actions={[
					{
						icon: (iconProps) => {
							return (
								<Ionicons name="musical-notes" {...iconProps} />
							);
						},
						label: "Song",
						onPress: () =>
							// @ts-ignore
							navigation.navigate("CreatePost", { type: "song" }),
					},
					// {
					// 	icon: (iconProps) => {
					// 		return (
					// 			<MaterialIcons
					// 				name="event-available"
					// 				{...iconProps}
					// 			/>
					// 		);
					// 	},
					// 	label: "Event",
					// 	onPress: () =>
					// 		// @ts-ignore
					// 		navigation.navigate("CreatePost", {
					// 			type: "event",
					// 		}),
					// },
				]}
				onStateChange={() => {
					setOpen((prev) => {
						return !prev;
					});
				}}
				onPress={() => {
					if (open) {
						// do something if the speed dial is open
					}
				}}
			/>
		</View>
	);
}
