import { useMutation, useQuery } from "@tanstack/react-query";
import { Linking, Pressable, View } from "react-native";
import { Avatar, IconButton, Text } from "react-native-paper";
import { useConfirmationDialog } from "../../GlobalConfirmationDialog/hooks/useConfirmationDialog";
import { singleTopNListItemQueryKey } from "../query/topNListItemQueryKeyFactory";
import { Toast } from "react-native-toast-message/lib/src/Toast";

type TopNListItemProps<
	T extends { images: SpotifyApi.ImageObject[]; name: string; url?: string }
> = {
	itemId: string;
	entityName: string;
	fetchItem: (id: string) => Promise<T>;
	onDeleteItem: (id: string) => Promise<any>;
	onDeleteSuccess: (id: string) => void;
};
const TopNListItem = <
	T extends { images: SpotifyApi.ImageObject[]; name: string; url?: string }
>({
	itemId,
	entityName,
	fetchItem,
	onDeleteItem,
	onDeleteSuccess,
}: TopNListItemProps<T>) => {
	const { data, isLoading } = useQuery({
		queryKey: singleTopNListItemQueryKey({ itemId, entity: entityName }),
		queryFn: () => fetchItem(itemId),
		onError: () => {
			Toast.show({
				text1: "Error",
				text2: `Error fetching ${entityName}`,
				type: "error",
			});
		},
	});

	const deleteArtist = useMutation({
		mutationFn: () => {
			return onDeleteItem(itemId);
		},
		onSuccess: () => {
			onDeleteSuccess(itemId);
		},
	});

	const { showConfirmationDialog } = useConfirmationDialog();

	return isLoading ? (
		<Text>Loading...</Text>
	) : (
		<>
			<Pressable
				onPress={() => {
					if (data?.url) Linking.openURL(data?.url);
				}}
			>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						padding: 12,
					}}
				>
					<Avatar.Image
						size={40}
						style={{ marginRight: 12 }}
						source={{ uri: data?.images[0]?.url ?? "" }}
					/>
					<Text
						variant="titleMedium"
						style={{ flexGrow: 1, flexShrink: 1 }}
					>
						{data?.name}
					</Text>
					<IconButton
						icon={"delete"}
						onPress={() =>
							showConfirmationDialog({
								title: `Delete ${entityName}`,
								description: `Are you sure you want to delete ${entityName}?`,
								negativeButton: {
									text: "Cancel",
									onPress: () => {},
								},
								positiveButton: {
									text: "Delete",
									onPress: () => {
										return deleteArtist
											.mutateAsync()
											.catch((e) => {});
									},
								},
							})
						}
						style={{}}
					></IconButton>
				</View>
			</Pressable>
		</>
	);
};
export default TopNListItem;
