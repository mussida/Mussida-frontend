import {
	AntDesign,
	Ionicons,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { Platform, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { FAB } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LoadingScreen from "../../components/Loadings/LoadingScreen/LoadingScreen";
import useGetRecommendedPosts, {
	getRecommendPostsQueryKey,
} from "../../components/Post/Hooks/useGetRecommendedPosts";
import SinglePost from "../../components/Post/SinglePost";
import { useExpoNotification } from "../../hooks/useRegisterForNotifications";
import { QueryPostsRouterGetRecommendedPost200ResponsePostsInner } from "spotifyApp-api-main-manager";

export default function Home() {
	const { bottom } = useSafeAreaInsets();

	const queryClient = useQueryClient();
	const navigation = useNavigation();
	const [open, setOpen] = React.useState(false);
	const { data, isLoading, isFetching, fetchNextPage, hasNextPage } =
		useGetRecommendedPosts();

	const posts = React.useMemo(() => {
		return data?.pages.reduce((acc, curr) => {
			return [...acc, ...curr.data.posts];
		}, [] as QueryPostsRouterGetRecommendedPost200ResponsePostsInner[]);
	}, [data]);

	const renderItem = React.useCallback(
		({
			item,
		}: {
			item: QueryPostsRouterGetRecommendedPost200ResponsePostsInner;
		}) => {
			return <SinglePost post={item} />;
		},
		[]
	);

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
				data={posts ?? []}
				renderItem={renderItem}
				onEndReached={() => {
					if (hasNextPage) {
						fetchNextPage();
					}
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
