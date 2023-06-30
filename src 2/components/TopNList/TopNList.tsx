import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useRef } from "react";
import { ScrollView, View } from "react-native";
import LoadingScreen from "../Loadings/LoadingScreen/LoadingScreen";
import { Button, FAB, Text } from "react-native-paper";
import { fontVariant } from "../../utils/fonts/fontVariant";
import { AntDesign } from "@expo/vector-icons";
import TopNListItem from "./components/TopNListItem";
import PickListItemBottomSheet from "./components/PickListItemBottomSheet";
import { Response } from "../../utils/interfaces/Response";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

type TopNListProps<
	//la fetch deve restituire una cosa che come minimo deve avere queste proprietà
	T extends { images: SpotifyApi.ImageObject[]; name: string }
> = {
	data: string[];
	entityName: string;
	isLoadingData?: boolean;
	maxLenght: number;
	fetchItem: (id: string) => Promise<T>;
	onDeleteItem: (id: string) => Promise<any>;
	onDeleteSuccess: (id: string) => void;
	searchEntity: (
		searchInput: string
	) => Promise<Response<SpotifyApi.SearchResponse>>;
	onAddItem: (item: {
		name: string;
		images: SpotifyApi.ImageObject[];
		id: string;
	}) => Promise<any>;
	onOptimisticAddItem: (item: {
		name: string;
		images: SpotifyApi.ImageObject[];
		id: string;
	}) => void;
	revalidateItems: () => void;
	extractItems: (data?: SpotifyApi.SearchResponse) => {
		name: string;
		images: SpotifyApi.ImageObject[];
		id: string;
	}[];
};

const TopNList = <
	T extends { images: SpotifyApi.ImageObject[]; name: string }
>({
	data,
	maxLenght,
	isLoadingData,
	entityName,
	fetchItem,
	onDeleteItem,
	onDeleteSuccess,
	searchEntity,
	onAddItem,
	onOptimisticAddItem,
	revalidateItems,
	extractItems,
}: TopNListProps<T>) => {
	const bottomSheetRef = useRef<BottomSheetModal>(null);
	if (isLoadingData) return <LoadingScreen />;

	return (
		<View style={{ width: "100%", height: "100%" }}>
			{data.length == 0 ? (
				<View
					style={{
						width: "100%",
						height: "100%",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Text
						variant="headlineSmall"
						style={{ fontFamily: fontVariant.bold, padding: 8 }}
					>
						The list is still empty!
					</Text>
					<Button
						style={{ marginTop: 16 }}
						mode="contained"
						onPress={() => {
							bottomSheetRef.current?.present();
						}}
						icon={(iconProps) => {
							return <AntDesign name="plus" {...iconProps} />;
						}}
					>
						{`Add ${entityName.toLowerCase()}`}
					</Button>
				</View>
			) : (
				<>
					<ScrollView style={{ height: "100%", margin: 0 }}>
						{data.map((itemId) => {
							return (
								<TopNListItem
									entityName={entityName}
									key={itemId}
									itemId={itemId}
									fetchItem={fetchItem}
									onDeleteItem={onDeleteItem}
									onDeleteSuccess={onDeleteSuccess}
								></TopNListItem>
							);
						})}
						<View style={{ height: 60 }}></View>
					</ScrollView>
					{(data.length ?? 0) < maxLenght && (
						<FAB
							icon={(iconProps) => {
								return <AntDesign name="plus" {...iconProps} />;
							}}
							style={{
								position: "absolute",
								margin: 16,
								bottom: 8,
								right: 0,
							}}
							onPress={() => {
								bottomSheetRef.current?.present();
							}}
						/>
					)}
				</>
			)}
			<PickListItemBottomSheet
				entityName={entityName}
				selectedItems={data}
				searchEntity={searchEntity}
				ref={bottomSheetRef}
				onAddItem={onAddItem}
				onOptimisticAddItem={onOptimisticAddItem}
				revalidateItems={revalidateItems}
				extractItems={extractItems}
			/>
		</View>
	);
};
export default TopNList;
