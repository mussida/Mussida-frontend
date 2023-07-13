import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { FlatList, Image, View } from "react-native";
import { Button, Text, TouchableRipple, useTheme } from "react-native-paper";
import { UsersApi } from "spotifyApp-api-main-manager/dist/api";
import LoadingModal from "../../../../components/Loadings/LoadingModal/LoadingModal";
import LoadingScreen from "../../../../components/Loadings/LoadingScreen/LoadingScreen";
import { useMe } from "../../../../hooks/useMe";
import { useApi } from "../../../../utils/api";
import { genres } from "../../../../utils/constants/genres";
import { fontVariant } from "../../../../utils/fonts/fontVariant";
import FavouritesButton from "./components/FavouritesButton";
import { useFavoutiteGenres } from "./queries/useFavouriteGenres";
import SinglePost from "../../../../components/Post/SinglePost";
import { PostsApi } from "spotifyApp-api-main-manager/dist/api";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useSafeAreaFrame } from "react-native-safe-area-context";

export default function ProfileHome() {
	const { data: me, isLoading: loadingProfile } = useMe();
	const { height } = useSafeAreaFrame();
	const { data: user, isLoading: isLoadingUser } = useQuery({
		queryKey: ["user", "profile"],
		queryFn: () => {
			return usersApi.queryUserRouterGetUser();
		},
	});
	const theme = useTheme();
	const { data: userGenres } = useFavoutiteGenres();
	const [selectedGenre, setSelectedGenre] = useState<string>();
	const usersApi = useApi(UsersApi);
	const queryClient = useQueryClient();
	// ref
	const bottomSheetRef = useRef<BottomSheet>(null);
	const { mutate, isLoading } = useMutation({
		mutationFn: (params: { genre: string }) => {
			const copiedFavouriteGenres = [...(userGenres?.data ?? [])];
			if (selectedGenre) {
				const replacedGenre =
					copiedFavouriteGenres.indexOf(selectedGenre);
				copiedFavouriteGenres[replacedGenre] = params.genre;
			} else {
				copiedFavouriteGenres.push(params.genre);
			}
			return usersApi.queryUserRouterEditGenres({
				favouriteGenres: copiedFavouriteGenres,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["profile", "favouriteGenres"]);
			bottomSheetRef.current?.close();
		},
	});

	// variables
	const snapPoints = useMemo(() => ["75%"], []);

	const postsApi = useApi(PostsApi);

	const { data: posts, isLoading: isLoadingPosts } = useQuery({
		queryKey: ["user", user?.data.id, "posts"],
		queryFn: () => {
			return postsApi.queryPostsRouterGetUserPosts(user?.data.id ?? "");
		},
		onError: () => {
			Toast.show({
				text1: "Error",
				text2: "Cannot load user's posts",
				type: "error",
			});
		},
		enabled: Boolean(user?.data.id),
	});

	const profileImage = me?.body.images?.reduce((prev, curr) => {
		if ((prev.height ?? 0) > (curr.height ?? 0)) return prev;
		return curr;
	}, me?.body.images?.[0]);

	if (loadingProfile || isLoadingUser) return <LoadingScreen />;
	return (
		<View style={{ height: "100%" }}>
			<FlatList
				// contentContainerStyle={{ paddingBottom: bottom }}
				ListHeaderComponent={
					<>
						<View
							style={{
								position: "relative",
								height: height * 0.3,
								justifyContent: "flex-end",
								borderBottomEndRadius: 12,
								borderBottomStartRadius: 12,
								overflow: "hidden",
							}}
						>
							{profileImage?.url ? (
								<Image
									source={{ uri: profileImage.url }}
									style={{
										width: "100%",
										height: "100%",
										position: "absolute",
									}}
									resizeMode="cover"
								/>
							) : (
								<View
									style={{
										width: "100%",
										height: "100%",
										position: "absolute",
										backgroundColor: theme.colors.primary,
									}}
								/>
							)}
							<View
								style={{
									width: "100%",
									height: "100%",
									position: "absolute",
									backgroundColor:
										"linear-gradient(0.38deg, rgba(0, 0, 0, 0.24) 0.34%, rgba(255, 255, 255, 0) 56.87%)",
								}}
							></View>
							<Text
								variant="headlineMedium"
								style={{
									fontFamily: fontVariant.bold,
									padding: 8,
								}}
							>
								{me?.body.display_name}
							</Text>
						</View>
						<View
							style={{
								flexDirection: "row",
								padding: 16,
								justifyContent: "space-around",
							}}
						>
							{userGenres?.data.map((genre, index) => {
								return (
									<Button
										onPress={() => {
											bottomSheetRef.current?.expand();
											setSelectedGenre(genre);
										}}
										mode="contained"
										style={{}}
										key={genre + "_" + index}
									>
										{genre}
									</Button>
								);
							})}
							{[
								...new Array(
									3 - (userGenres?.data.length ?? 0)
								),
							].map((_, index) => {
								return (
									<Button
										onPress={() => {
											bottomSheetRef.current?.expand();
											setSelectedGenre(undefined);
										}}
										mode="contained"
										style={{}}
										key={"_" + index}
									>
										<MaterialIcons
											name="add"
											size={20}
											color={"black"}
										/>
									</Button>
								);
							})}
						</View>
						<FavouritesButton
							text="Top 10 artists"
							path="Top10Artists"
							variant="artists"
							data={user?.data.top10Artists ?? []}
						></FavouritesButton>
						<FavouritesButton
							text="Top 10 songs"
							path="Top10Songs"
							variant="songs"
							data={user?.data.top10Songs ?? []}
						></FavouritesButton>
					</>
				}
				ListEmptyComponent={() => {
					return <Text>Loading posts</Text>;
				}}
				renderItem={(item) => {
					return <SinglePost post={item.item} />;
				}}
				data={posts?.data ?? []}
			></FlatList>
			{/* <FavouritesButton
        text="Top 5 playlists"
        path="Top5Playlists"
      ></FavouritesButton> */}
			<BottomSheet
				style={{}}
				backgroundStyle={{ backgroundColor: theme.colors.background }}
				enablePanDownToClose
				handleIndicatorStyle={{
					backgroundColor: theme.colors.onBackground,
				}}
				ref={bottomSheetRef}
				index={-1}
				snapPoints={snapPoints}
			>
				<BottomSheetScrollView>
					{genres.map((genre, index) => {
						return (
							<TouchableRipple
								style={{
									opacity: userGenres?.data.includes(genre)
										? 0.5
										: 1,
								}}
								onPress={() => {
									mutate({ genre });
								}}
								key={"bottomSheet" + genre + "_" + index}
								underlayColor={theme.colors.primary}
								//disabled={userGenres?.data.includes(genre)}
							>
								<View
									style={{
										padding: 12,
										flexDirection: "row",
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<Text>{genre}</Text>
									{genre === selectedGenre && (
										<AntDesign
											name="checkcircle"
											size={24}
											color={theme.colors.primary}
										/>
									)}
								</View>
							</TouchableRipple>
						);
					})}
				</BottomSheetScrollView>
			</BottomSheet>
			<LoadingModal visible={isLoading} />
		</View>
	);
}
