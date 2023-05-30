import {
	BottomSheetFlatList,
	BottomSheetModal,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useThrottle } from "@react-hook/throttle";
import { useMutation, useQuery } from "@tanstack/react-query";
import { forwardRef, useMemo, useState } from "react";
import {
	Avatar,
	Text,
	TextInput,
	TouchableRipple,
	useTheme,
} from "react-native-paper";

import { View } from "react-native";

import Toast from "react-native-toast-message";
import { useForwardedRef } from "../../../hooks/useForwardedRef";
import { fontVariant } from "../../../utils/fonts/fontVariant";
import { Response } from "../../../utils/interfaces/Response";

type Props = {
	selectedItems: string[];
	entityName: string;
	searchEntity: (
		searchInput: string
	) => Promise<Response<SpotifyApi.SearchResponse>>;
	extractItems: (data?: SpotifyApi.SearchResponse) => {
		name: string;
		images: SpotifyApi.ImageObject[];
		id: string;
	}[];
	onAddItem: (item: {
		name: string;
		images: SpotifyApi.ImageObject[];
		id: string;
	}) => Promise<any>;
	onOptimisticAddItem?: (item: {
		name: string;
		images: SpotifyApi.ImageObject[];
		id: string;
	}) => void;
	revalidateItems?: () => void;
};

const PickListItemBottomSheet = forwardRef<BottomSheetModalMethods, Props>(
	(
		{
			selectedItems,
			entityName,
			searchEntity,
			onAddItem,
			onOptimisticAddItem,
			revalidateItems,
			extractItems,
		},
		ref
	) => {
		const bottomSheetRef = useForwardedRef(ref);
		const snapPoints = useMemo(() => ["95%"], []);
		const theme = useTheme();

		const [searchInput, setSearchInput] = useState("");
		const [throttledSearchInput, setThrottledSearchInput] = useThrottle("");
		const addItemToFavorite = useMutation({
			onMutate: (item) => {
				onOptimisticAddItem?.(item);
			},
			mutationFn: (item: {
				name: string;
				images: SpotifyApi.ImageObject[];
				id: string;
			}) => {
				return onAddItem(item);
			},
			onSettled: () => {
				revalidateItems?.();
			},
			onError: () => {
				Toast.show({
					type: "error",
					text1: "Operation failed",
					text2: `Adding ${entityName} failed, retry!`,
				});
			},
		});
		const { data, isLoading } = useQuery({
			queryKey: ["search", throttledSearchInput],
			queryFn: () => searchEntity(throttledSearchInput),
			enabled: throttledSearchInput !== "",
			keepPreviousData: throttledSearchInput !== "",
		});

		const dataArray = extractItems(data?.body);

		return (
			<BottomSheetModal
				style={{}}
				backgroundStyle={{ backgroundColor: theme.colors.background }}
				enablePanDownToClose
				handleIndicatorStyle={{
					backgroundColor: theme.colors.onBackground,
				}}
				ref={bottomSheetRef}
				index={0}
				snapPoints={snapPoints}
			>
				<BottomSheetView style={{ padding: 7 }}>
					<TextInput
						mode="outlined"
						style={{ width: "100%" }}
						placeholder={`Search ${entityName}`}
						value={searchInput}
						onChangeText={(text) => {
							setSearchInput(text);
							setThrottledSearchInput(text);
						}}
					/>
				</BottomSheetView>
				{dataArray.length ? (
					<BottomSheetFlatList
						style={{ padding: 8 }}
						data={dataArray ?? []}
						keyExtractor={(item) => {
							return item.id;
						}}
						renderItem={({ item }) => {
							return (
								<TouchableRipple
									disabled={selectedItems.includes(item.id)}
									style={{
										opacity: selectedItems.includes(item.id)
											? 0.5
											: 1,
									}}
									onPress={() => {
										addItemToFavorite.mutate(item);
										setSearchInput("");
										setThrottledSearchInput("");
										bottomSheetRef.current?.dismiss();
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
								: `No ${entityName} with this name`}
						</Text>
					</View>
				)}
			</BottomSheetModal>
		);
	}
);
export default PickListItemBottomSheet;
