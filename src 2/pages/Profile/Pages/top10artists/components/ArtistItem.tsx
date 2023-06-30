import { useMutation, useQueryClient } from "@tanstack/react-query";
import { View } from "react-native";
import { Avatar, IconButton, Text } from "react-native-paper";
import { UsersApi } from "spotifyApp-api-main-manager/dist/api";
import { useConfirmationDialog } from "../../../../../components/GlobalConfirmationDialog/hooks/useConfirmationDialog";
import { useApi } from "../../../../../utils/api";
import useSingleArtist from "../Hooks/useSingleArtist";
import useTop10Artists, {
	Top10ArtistRes,
	top10ArtistQueryKey,
} from "../Hooks/useTop10Artits";

export default function ArtistItem({ artistId }: { artistId: string }) {
	const { data, isLoading } = useSingleArtist(artistId);
	const queryClient = useQueryClient();
	const userApi = useApi(UsersApi);
	const { data: top10Artists } = useTop10Artists();
	const deleteArtist = useMutation({
		mutationFn: () => {
			return userApi.queryUserRouterEditTop10Artist({
				top10Artists: (top10Artists?.data ?? []).filter((value) => {
					return value !== artistId;
				}),
			});
		},
		onSuccess: () => {
			queryClient.setQueryData<Top10ArtistRes>(
				top10ArtistQueryKey,
				(old) => {
					if (!old) return old;
					return {
						...old,
						data: old.data.filter((value) => {
							return value !== artistId;
						}),
					};
				}
			);
		},
	});

	const { showConfirmationDialog } = useConfirmationDialog();

	return isLoading ? (
		<Text>Loading...</Text>
	) : (
		<>
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
					source={{ uri: data?.body.images[0]?.url ?? "" }}
				/>
				<Text
					variant="titleMedium"
					style={{ flexGrow: 1, flexShrink: 1 }}
				>
					{data?.body.name}
				</Text>
				<IconButton
					icon={"delete"}
					onPress={() =>
						showConfirmationDialog({
							title: "Delete artist",
							description:
								"Are you sure you want to delete this artist?",
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
		</>
	);
}
