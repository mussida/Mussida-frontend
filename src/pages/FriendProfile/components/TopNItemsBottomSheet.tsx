import {
	BottomSheetFlatList,
	BottomSheetModal,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { forwardRef, useMemo } from "react";
import { View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import { fontVariant } from "../../../utils/fonts/fontVariant";
import { useQuery } from "@tanstack/react-query";
import { spotifyApi } from "../../../utils/spotifyClients";

const ListItem = ({
	item,
	type,
}: {
	item: string;
	type: "songs" | "artists";
}) => {
	const { data, isLoading } = useQuery({
		queryKey: ["get", type, item],
		queryFn: () => {
			if (type === "artists") {
				return spotifyApi.getArtist(item).then((res) => {
					return {
						image: res.body.images?.[0],
						name: res.body.name,
						id: res.body.id,
					};
				});
			} else {
				return spotifyApi.getTrack(item).then((res) => {
					return {
						image: res.body.album.images?.[0],
						name: res.body.name,
						id: res.body.id,
					};
				});
			}
		},
	});

	if (isLoading) {
		return <Text>Loading...</Text>;
	}

	return (
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
					uri: data?.image?.url ?? "",
				}}
			/>
			<Text variant="titleMedium">{data?.name ?? ""}</Text>
		</View>
	);
};

type TopNItemsBottomSheetProps = {
	data: string[];
	entityName: "songs" | "artists";
	isLoadingData?: boolean;
};
const TopNItemsBottomSheet = forwardRef<
	BottomSheetModalMethods,
	TopNItemsBottomSheetProps
>(({ data, isLoadingData, entityName }, bottomSheetRef) => {
	const theme = useTheme();
	const snapPoints = useMemo(() => ["80%"], []);

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
			{data.length ? (
				<BottomSheetFlatList
					style={{ padding: 8 }}
					data={data ?? []}
					keyExtractor={(item) => {
						return item;
					}}
					renderItem={({ item }) => {
						return <ListItem item={item} type={entityName} />;
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
						{isLoadingData ? "Loading..." : ""}
					</Text>
				</View>
			)}
		</BottomSheetModal>
	);
});
export default TopNItemsBottomSheet;
