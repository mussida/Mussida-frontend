import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Keyboard, Pressable, TouchableOpacity, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import {
	PostsApi,
	QueryPostsRouterCreateNormalPostRequestTagsInner,
} from "spotifyApp-api-main-manager";
import { useApi } from "../../utils/api";
import { Response } from "../../utils/interfaces/Response";
import { spotifyApi } from "../../utils/spotifyClients";
import PickListItemBottomSheet from "../TopNList/components/PickListItemBottomSheet";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useNavigation } from "@react-navigation/native";
import { getRecommendPostsQueryKey } from "./Hooks/useGetRecommendedPosts";

export default function NormalPost() {
	const queryClient = useQueryClient();
	const navigation = useNavigation();
	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const [song, setSong] = useState<{
		name: string;
		images: SpotifyApi.ImageObject[];
		id: string;
	}>();
	const [caption, setCaption] = useState("");
	const postApi = useApi(PostsApi);
	const publishPost = useMutation({
		mutationFn: async () => {
			if (song?.id === undefined) throw new Error("song id is undefined");
			const fullTrack = await spotifyApi.getTrack(song.id);
			const album = await spotifyApi.getAlbum(fullTrack.body.album.id);
			return postApi.queryPostsRouterCreateNormalPost({
				caption,
				songId: song.id,
				tags: [
					{
						name: fullTrack.body.name,
						resourceId: song.id,
						type: {
							type: "Song",
						},
					},
					...fullTrack.body.artists.map((artist) => {
						return {
							name: artist.name,
							resourceId: artist.id,
							type: {
								type: "Artist",
							},
						} as QueryPostsRouterCreateNormalPostRequestTagsInner;
					}),
					...album.body.genres.map((genre) => {
						return {
							name: genre,
							type: {
								type: "Genre",
							},
						} as QueryPostsRouterCreateNormalPostRequestTagsInner;
					}),
				],
			});
		},
		onError: () => {
			Toast.show({
				text1: "Error!",
				text2: "Failed to publish post",
				type: "error",
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries(getRecommendPostsQueryKey);
			//@ts-ignore
			navigation.navigate("Home");
		},
	});
	return (
		<>
			<View style={{ padding: 20 }}>
				<Pressable
					onPress={() => {
						bottomSheetRef.current?.present();
					}}
				>
					<TextInput
						onPressIn={() => {
							bottomSheetRef.current?.present();
						}}
						mode="outlined"
						value={song?.name || ""}
						editable={false}
						placeholder="select a song"
						multiline
					/>
				</Pressable>
				<TextInput
					mode="outlined"
					placeholder="type a caption"
					multiline
					label="Caption"
					onChangeText={(text) => {
						setCaption(text);
					}}
					onEndEditing={() => {
						console.log("end");
					}}
					value={caption}
					style={{ marginTop: 16 }}
				/>
				<PickListItemBottomSheet
					ref={bottomSheetRef}
					selectedItems={[]}
					entityName={"song"}
					searchEntity={function (
						searchInput: string
					): Promise<Response<SpotifyApi.SearchResponse>> {
						return spotifyApi.searchTracks(searchInput);
					}}
					extractItems={function (
						data?: SpotifyApi.SearchResponse | undefined
					): {
						name: string;
						images: SpotifyApi.ImageObject[];
						id: string;
					}[] {
						return (data?.tracks?.items || []).map((track) => {
							return {
								id: track.id,
								name: track.name,
								images: track.album.images,
							};
						});
					}}
					onAddItem={function (item) {
						setSong(item);
						return Promise.resolve();
					}}
				></PickListItemBottomSheet>
			</View>
			<View style={{ padding: 12 }}>
				<Button
					loading={publishPost.isLoading}
					mode="contained"
					style={{ width: "100%", marginBottom: 16 }}
					onPress={() => {
						publishPost.mutate();
					}}
				>
					Publish
				</Button>
			</View>
		</>
	);
}
