import BottomSheet, {
	BottomSheetFlatList,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useThrottle } from "@react-hook/throttle";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { forwardRef, useMemo, useState } from "react";
import { View } from "react-native";
import {
	Avatar,
	Text,
	TextInput,
	TouchableRipple,
	useTheme,
} from "react-native-paper";
import Toast from "react-native-toast-message";
import { UsersApi } from "spotifyApp-api-main-manager";
import { useForwardedRef } from "../../../../../hooks/useForwardedRef";
import { useApi } from "../../../../../utils/api";
import { fontVariant } from "../../../../../utils/fonts/fontVariant";
import { spotifyApi } from "../../../../../utils/spotifyClients";
import useTop10Artists, {
	Top10ArtistRes,
	top10ArtistQueryKey,
} from "../Hooks/useTop10Artits";
const AddArtistBottomSheet = forwardRef<BottomSheetMethods, {}>(
	(props, ref) => {
		const { data: top10Artists } = useTop10Artists();
		const usersApi = useApi(UsersApi);
		const bottomSheetRef = useForwardedRef(ref);
		const snapPoints = useMemo(() => ["95%"], []);
		const theme = useTheme();
		const [searchInput, setSearchInput] = useState("");
		const [throttledSearchInput, setThrottledSearchInput] = useThrottle("");
		const queryClient = useQueryClient();
		const addArtistToFavourite = useMutation({
			onMutate: (artistId) => {
				queryClient.setQueryData<Top10ArtistRes>(
					top10ArtistQueryKey,
					(old) => {
						if (!old) return old;
						return { ...old, data: [...old.data, artistId] };
					}
				);
			},
			mutationFn: (artistId: string) => {
				//throw new Error();
				return usersApi.queryUserRouterEditTop10Artist({
					top10Artists: [...(top10Artists?.data ?? []), artistId],
				});
			},
			//rifetchamo cosi se error ci toglie elemento dalla lista
			onSettled: () => {
				queryClient.invalidateQueries(top10ArtistQueryKey);
			},
			onError: (error) => {
				Toast.show({
					type: "error",
					text1: "Operation failed",
					text2: "adding artist failed, retry",
				});
			},
		});
		const { data, isLoading } = useQuery({
			queryKey: ["search", throttledSearchInput],
			queryFn: () => spotifyApi.searchArtists(throttledSearchInput),
			enabled: throttledSearchInput !== "",
			keepPreviousData: throttledSearchInput !== "",
		});

		return (
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
				<BottomSheetView style={{ padding: 7 }}>
					<TextInput
						mode="outlined"
						style={{ width: "100%" }}
						placeholder="Search artist"
						value={searchInput}
						onChangeText={(text) => {
							setSearchInput(text);
							setThrottledSearchInput(text);
						}}
					/>
				</BottomSheetView>

				{data?.body.artists?.items.length ? (
					<BottomSheetFlatList
						style={{ padding: 8 }}
						data={data?.body.artists?.items ?? []}
						keyExtractor={(item) => {
							return item.id;
						}}
						renderItem={({ item }) => {
							return (
								<TouchableRipple
									disabled={top10Artists?.data.includes(
										item.id
									)}
									style={{
										opacity: top10Artists?.data.includes(
											item.id
										)
											? 0.5
											: 1,
									}}
									onPress={() => {
										addArtistToFavourite.mutate(item.id);
										bottomSheetRef.current?.close();
										setSearchInput("");
										setThrottledSearchInput("");
									}}
									underlayColor={theme.colors.primary}
									//disabled={userGenres?.data.includes(genre)}
								>
									<View
										style={{
											padding: 12,
											flexDirection: "row",
											alignItems: "center",
										}}
									>
										<Avatar.Image
											size={40}
											style={{ marginRight: 12 }}
											source={{
												uri: item.images[0]?.url ?? "",
											}}
										/>
										<Text variant="titleMedium">
											{item.name}
										</Text>
										{/* {genre === selectedGenre && (
                    <AntDesign
                      name="checkcircle"
                      size={24}
                      color={theme.colors.primary}
                    />
                  )} */}
									</View>
								</TouchableRipple>
							);
						}}
					>
						{}
					</BottomSheetFlatList>
				) : (
					<View
						style={{
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Text
							variant="headlineSmall"
							style={{ fontFamily: fontVariant.bold, padding: 8 }}
						>
							{searchInput.length == 0
								? "Start typing to search"
								: isLoading
								? "Loading..."
								: "No artists with this name"}
						</Text>
					</View>
				)}
			</BottomSheet>
		);
	}
);
export default AddArtistBottomSheet;
