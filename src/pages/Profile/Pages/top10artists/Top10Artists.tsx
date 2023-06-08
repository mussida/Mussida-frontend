import { SafeAreaView } from "react-native-safe-area-context";
import LoadingScreen from "../../../../components/Loadings/LoadingScreen/LoadingScreen";
import useTop10Artists from "./Hooks/useTop10Artits";
import { View } from "react-native";
import { Button, FAB, Text } from "react-native-paper";
import { fontVariant } from "../../../../utils/fonts/fontVariant";
import { AntDesign } from "@expo/vector-icons";
import AddArtistBottomSheet from "./components/AddArtistBottomSheet";
import { useRef } from "react";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { ScrollView } from "react-native";
import ArtistItem from "./components/ArtistItem";

export default function Top10Artists() {
	const { data, isLoading } = useTop10Artists();
	const addArtistRef = useRef<BottomSheetMethods>(null);
	if (isLoading) return <LoadingScreen />;
	return (
		<View style={{ width: "100%", height: "100%" }}>
			{data?.data.length == 0 ? (
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
							addArtistRef.current?.expand();
						}}
						icon={(iconProps) => {
							return <AntDesign name="plus" {...iconProps} />;
						}}
					>
						Add artist
					</Button>
				</View>
			) : (
				<>
					<ScrollView style={{ height: "100%", margin: 0 }}>
						{data?.data.map((artistId) => {
							return (
								<ArtistItem
									key={artistId}
									artistId={artistId}
								></ArtistItem>
							);
						})}
						<View style={{ height: 60 }}></View>
					</ScrollView>
					{(data?.data.length ?? 0) < 10 && (
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
								addArtistRef.current?.expand();
							}}
						/>
					)}
				</>
			)}
			<AddArtistBottomSheet ref={addArtistRef} />
		</View>
	);
}
