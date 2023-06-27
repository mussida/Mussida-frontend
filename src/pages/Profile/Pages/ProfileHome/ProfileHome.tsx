import { SafeAreaView } from "react-native-safe-area-context";
import { useMe } from "../../../../hooks/useMe";
import { Image, ImageStore, View } from "react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import {
	Button,
	Text,
	TouchableRipple,
	useTheme,
	Snackbar,
} from "react-native-paper";
import { fontVariant } from "../../../../utils/fonts/fontVariant";
import {
	parseMutationArgs,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { spotifyApi } from "../../../../utils/spotifyClients";
import { useFavoutiteGenres } from "./queries/useFavouriteGenres";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { genres } from "../../../../utils/constants/genres";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useApi } from "../../../../utils/api";
import { UsersApi } from "spotifyApp-api-main-manager/dist/api";
import LoadingModal from "../../../../components/Loadings/LoadingModal/LoadingModal";
import FavouritesButton from "./components/FavouritesButton";
import LoadingScreen from "../../../../components/Loadings/LoadingScreen/LoadingScreen";

export default function ProfileHome() {
	const { data: me, isLoading: loadingProfile } = useMe();
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
	const { mutate, isLoading, isError } = useMutation({
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

	// callbacks
	const handleSheetChanges = useCallback((index: number) => {
		console.log("handleSheetChanges", index);
	}, []);

	if (loadingProfile || isLoadingUser) return <LoadingScreen />;
	return (
		<View style={{ height: "100%" }}>
			<View
				style={{
					position: "relative",
					height: "35%",
					justifyContent: "flex-end",
					borderBottomEndRadius: 12,
					borderBottomStartRadius: 12,
					overflow: "hidden",
				}}
			>
				<Image
					source={{ uri: me?.body.images?.[0].url }}
					style={{
						width: "100%",
						height: "100%",
						position: "absolute",
					}}
					resizeMode="cover"
				/>
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
					style={{ fontFamily: fontVariant.bold, padding: 8 }}
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
				{[...new Array(3 - (userGenres?.data.length ?? 0))].map(
					(_, index) => {
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
					}
				)}
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
			<Snackbar visible={isError} onDismiss={() => {}} duration={3000}>
				Hey there! I'm a Snackbar.
			</Snackbar>
			<LoadingModal visible={isLoading} />
		</View>
	);
}
