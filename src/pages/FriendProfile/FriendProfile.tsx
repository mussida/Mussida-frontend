import { useQuery } from "@tanstack/react-query";
import { FlatList, ScrollView, View } from "react-native";
import { Avatar, Button, Chip, Text } from "react-native-paper";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { UsersApi } from "spotifyApp-api-main-manager/dist/api";
import LoadingScreen from "../../components/Loadings/LoadingScreen/LoadingScreen";
import { useApi } from "../../utils/api";
import { fontVariant } from "../../utils/fonts/fontVariant";
import { spotifyApi } from "../../utils/spotifyClients";
import FavouritesButton from "../Profile/Pages/ProfileHome/components/FavouritesButton";
import { PostsApi } from "spotifyApp-api-main-manager/dist/api";
import SinglePost from "../../components/Post/SinglePost";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsFollowing, useToggleFollowUser } from "./hooks/useIsFollowing";
import TopNItemsBottomSheet from "./components/TopNItemsBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import AvatarWithFallback from "../../components/AvatarWithFallback";

const FriendProfile = ({
	route,
}: {
	route: {
		params: {
			userId: string;
		};
	};
}) => {
	const { userId } = route.params;
	const userApi = useApi(UsersApi);
	const postsApi = useApi(PostsApi);

	const top10ArtistsBottomSheet = useRef<BottomSheetModal>(null);
	const top10SongsBottomSheet = useRef<BottomSheetModal>(null);

	const { data: isFollowingData, isLoading: isLoadingFollowingData } =
		useIsFollowing(userId);
	const toggleFollowUser = useToggleFollowUser({
		userId,
		isFollowing: isFollowingData?.data ?? false,
	});
	const { bottom } = useSafeAreaInsets();
	const { data: user, isLoading: isLoadingUser } = useQuery({
		queryKey: ["user", userId],
		queryFn: () => {
			return userApi.queryUserRouterGetUserById(userId);
		},
		onError: () => {
			Toast.show({
				text1: "Error",
				text2: "Cannot load user",
				type: "error",
			});
		},
	});

	const { data: spotifyUser, isLoading: isLoadingSpotifyUser } = useQuery({
		queryKey: ["user", "spotify", userId],
		queryFn: () => {
			return spotifyApi.getUser(userId);
		},
		onError: () => {
			Toast.show({
				text1: "Error",
				text2: "Cannot load user from spotify",
				type: "error",
			});
		},
	});

	const { data: posts, isLoading: isLoadingPosts } = useQuery({
		queryKey: ["user", userId, "posts"],
		queryFn: () => {
			return postsApi.queryPostsRouterGetUserPosts(userId);
		},
		onError: () => {
			Toast.show({
				text1: "Error",
				text2: "Cannot load user's posts",
				type: "error",
			});
		},
	});

	if (isLoadingUser || isLoadingSpotifyUser) return <LoadingScreen />;

	return (
		// <SafeAreaView>
		<>
			<FlatList
				contentContainerStyle={{ paddingBottom: bottom }}
				ListHeaderComponent={
					<>
						<View style={{ padding: 12, alignItems: "center" }}>
							<AvatarWithFallback
								size={64}
								style={{ marginBottom: 12 }}
								uri={spotifyUser?.body.images?.[0]?.url ?? ""}
							/>
							<Text
								variant="bodyLarge"
								style={{
									fontFamily: fontVariant.bold,
								}}
							>
								{spotifyUser?.body.display_name ?? "Unknown"}
							</Text>
							<Button
								onPress={() => {
									toggleFollowUser.mutate();
								}}
								loading={
									isLoadingFollowingData ||
									toggleFollowUser.isLoading
								}
								style={{ marginTop: 12 }}
								mode="contained"
							>
								{isFollowingData?.data ? "Unfollow" : "Follow"}
							</Button>
						</View>
						<View
							style={{
								width: "100%",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							{user?.data.favouriteGenres.map((genre, index) => {
								return (
									<Chip
										style={{
											marginRight:
												index ===
												user?.data.favouriteGenres
													.length -
													1
													? 0
													: 8,
										}}
										key={genre}
									>
										{genre}
									</Chip>
								);
							})}
						</View>
						{(user?.data.top10Artists ?? []).length > 0 && (
							<FavouritesButton
								text="Top 10 artists"
								variant="artists"
								onPress={() => {
									top10ArtistsBottomSheet.current?.present();
								}}
								data={user?.data.top10Artists ?? []}
							/>
						)}
						{(user?.data.top10Songs ?? []).length > 0 && (
							<FavouritesButton
								text="Top 10 songs"
								onPress={() => {
									top10SongsBottomSheet.current?.present();
								}}
								variant="songs"
								data={user?.data.top10Songs ?? []}
							/>
						)}
					</>
				}
				renderItem={(item) => {
					return <SinglePost post={item.item} />;
				}}
				data={posts?.data ?? []}
			></FlatList>
			<TopNItemsBottomSheet
				data={user?.data.top10Artists ?? []}
				ref={top10ArtistsBottomSheet}
				entityName="artists"
			/>
			<TopNItemsBottomSheet
				data={user?.data.top10Songs ?? []}
				entityName="songs"
				ref={top10SongsBottomSheet}
			/>
		</>
		// </SafeAreaView>
	);
};
export default FriendProfile;
