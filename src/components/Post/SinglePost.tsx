import { FontAwesome5 } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { useAtom } from "jotai";
import React from "react";
import { Image, Platform, View } from "react-native";
import {
	ActivityIndicator,
	Avatar,
	Card,
	Chip,
	Text,
	TouchableRipple,
	useTheme,
} from "react-native-paper";
import { QueryPostsRouterGetRecommendedPost200ResponseInner } from "spotifyApp-api-main-manager";
import { fontVariant } from "../../utils/fonts/fontVariant";
import { spotifyApi } from "../../utils/spotifyClients";
import { getRecommendPostsQueryKey } from "./Hooks/useGetRecommendedPosts";
import { audioAtom } from "./atoms/audioAtom";

export default function SinglePost({
	post,
}: {
	post: QueryPostsRouterGetRecommendedPost200ResponseInner;
}) {
	const theme = useTheme();
	const [audio, setAudio] = useAtom(audioAtom);

	const { data: track, isLoading: isLoadingTrack } = useQuery({
		queryKey: [...getRecommendPostsQueryKey, "track", post.songId],
		queryFn: async () => {
			return spotifyApi.getTrack(post.songId);
		},
	});

	const { data: creator, isLoading: isLoadingCreator } = useQuery({
		queryKey: [...getRecommendPostsQueryKey, "creator", post.createdById],
		queryFn: async () => {
			return spotifyApi.getUser(post.createdById);
		},
	});

	const isLoading = isLoadingTrack || isLoadingCreator;

	if (isLoading) {
		return (
			<View>
				<Text>Loading...</Text>
			</View>
		);
	}

	return (
		<Card style={{ marginTop: 12, padding: 8 }}>
			<View style={{ alignItems: "center", flexDirection: "row" }}>
				<Avatar.Image
					size={36}
					style={{ marginRight: 12 }}
					source={{
						uri: creator?.body.images?.[0]?.url ?? "",
					}}
				/>

				<Text
					style={{
						fontFamily: fontVariant.bold,
					}}
				>
					{creator?.body.display_name ?? "Unknown"}
				</Text>
			</View>
			<Text style={{ marginTop: 12 }}>{post.caption}</Text>
			<View
				style={{
					flexDirection: "row",
					flexWrap: "wrap",
					marginLeft: -4,
				}}
			>
				{post.tags.map((tag, index) => {
					return (
						<Chip
							compact
							textStyle={{
								fontSize: 12,
							}}
							style={{
								width: "auto",
								marginLeft: 4,
								marginTop: 4,
							}}
							key={tag.id}
						>
							{tag.name}
						</Chip>
					);
				})}
			</View>
			<View
				style={{
					width: "100%",
					position: "relative",
					marginTop: 12,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Image
					style={{
						width: "100%",
						borderRadius: 8,
						aspectRatio: 1,
					}}
					source={{
						uri: track?.body.album.images[0]?.url ?? "",
					}}
				/>
				<TouchableRipple
					onPress={async () => {
						if (!audio?.audio) {
							const newAudio = await Audio.Sound.createAsync({
								uri: track?.body.preview_url ?? "",
							});
							setAudio({ postId: post.id, audio: newAudio });
							if (Platform.OS === "ios") {
								await Audio.setAudioModeAsync({
									staysActiveInBackground: true,
									shouldDuckAndroid: false,
									playThroughEarpieceAndroid: false,
									allowsRecordingIOS: false,
									interruptionModeAndroid:
										InterruptionModeAndroid.DoNotMix,
									interruptionModeIOS:
										InterruptionModeIOS.DoNotMix,
									playsInSilentModeIOS: true,
								});
							}
							newAudio.sound.playAsync();
							newAudio.sound.setProgressUpdateIntervalAsync(1000);
							newAudio.sound.setOnPlaybackStatusUpdate(
								(status) => {
									if (
										status.isLoaded &&
										(status.durationMillis ?? 0) -
											status.positionMillis <=
											1000
									) {
										newAudio.sound.stopAsync();
										newAudio.sound.setPositionAsync(0);
										setAudio((prev) => ({
											...prev,
											isPlaying: false,
										}));
									}
								}
							);
							setAudio((prev) => ({
								...prev,
								isPlaying: true,
							}));
						} else {
							if (audio.postId !== post.id) {
								setAudio((prev) => ({
									...prev,
									postId: post.id,
								}));
								await audio?.audio.sound.unloadAsync();
								await audio.audio.sound.loadAsync({
									uri: track?.body.preview_url ?? "",
								});
								audio.audio?.sound.playAsync();
								setAudio((prev) => ({
									...prev,
									isPlaying: true,
								}));
							} else {
								if (audio.isPlaying) {
									audio?.audio.sound.pauseAsync();
									setAudio((prev) => ({
										...prev,
										isPlaying: false,
									}));
								} else {
									audio?.audio.sound.playAsync();
									setAudio((prev) => ({
										...prev,
										isPlaying: true,
									}));
								}
							}
						}
					}}
					underlayColor={theme.colors.primary}
					style={{
						position: "absolute",
						shadowRadius: 12,
						shadowOpacity: 0.8,
					}}
				>
					{audio?.postId === post.id &&
					audio.audio?.sound._loading ? (
						<ActivityIndicator size="large" />
					) : !audio?.isPlaying || audio.postId !== post.id ? (
						<FontAwesome5 name="play" size={40} color="white" />
					) : (
						<FontAwesome5 name="pause" size={40} color="white" />
					)}
				</TouchableRipple>
			</View>
		</Card>
	);
}
