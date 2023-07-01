import { FontAwesome5 } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { useAtom } from "jotai";
import React, { useRef } from "react";
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
import { useUser } from "../../hooks/useMe";
import { fontVariant } from "../../utils/fonts/fontVariant";
import { spotifyApi } from "../../utils/spotifyClients";
import { getRecommendPostsQueryKey } from "./Hooks/useGetRecommendedPosts";
import { audioAtom } from "./atoms/audioAtom";
import PostComments from "./components/PostComments";
import AvatarWithFallback from "../AvatarWithFallback";

// Il player funziona che quando premi play se non hai mai premuto play allora crea un istanza
// della classe Audio passandogli l'url della traccia. Una volta creata l'istanza fa play.
// Quando invece fai play su un altra canzone, invece di ricreare l'audio, semplicemente gli
// carica un altra traccia dato l'url

export default function SinglePost({
	post,
}: {
	post: QueryPostsRouterGetRecommendedPost200ResponseInner;
}) {
	const { data: me, isLoading: isLoadingMe } = useUser();
	const navigation = useNavigation();
	const theme = useTheme();
	const [audio, setAudio] = useAtom(audioAtom);

	const commentsBottomSheetRef = useRef<BottomSheetModal>(null);

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

	const isLoading = isLoadingTrack || isLoadingCreator || isLoadingMe;

	if (isLoading) {
		return null;
	}

	return (
		<>
			<Card style={{ marginTop: 12, padding: 8 }}>
				<TouchableRipple
					onPress={() => {
						post.createdById === me?.data.id
							? //@ts-expect-error
							  navigation.navigate("Profile")
							: //@ts-expect-error
							  navigation.navigate("FriendProfile", {
									userId: post.createdById,
							  });
					}}
					style={{
						padding: 8,
						borderRadius: 8,
					}}
					underlayColor={theme.colors.primary}
				>
					<View
						style={{ alignItems: "center", flexDirection: "row" }}
					>
						<AvatarWithFallback
							size={36}
							style={{ marginRight: 12 }}
							uri={creator?.body.images?.[0]?.url ?? ""}
						/>
						<Text
							style={{
								fontFamily: fontVariant.bold,
							}}
						>
							{creator?.body.display_name ?? "Unknown"}
						</Text>
					</View>
				</TouchableRipple>
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
							//STARTING FIRST PLAYER
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
								newAudio.sound.setProgressUpdateIntervalAsync(
									1000
								);
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
								//PAUSE RUNNING SONG AND START NEW ONE
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
									//PAUSE
									if (audio.isPlaying) {
										audio?.audio.sound.pauseAsync();
										setAudio((prev) => ({
											...prev,
											isPlaying: false,
										}));
									} else {
										//PLAY
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
							<FontAwesome5
								name="pause"
								size={40}
								color="white"
							/>
						)}
					</TouchableRipple>
				</View>
				<TouchableRipple
					underlayColor={theme.colors.primary}
					style={{ marginTop: 8, borderRadius: 8 }}
					onPress={() => {
						commentsBottomSheetRef.current?.present();
					}}
				>
					<View style={{ padding: 8 }}>
						<Text style={{ fontFamily: fontVariant.bold }}>
							{post.comments.length
								? `View ${post.comments.length} comments`
								: "No comments yet"}
						</Text>
					</View>
				</TouchableRipple>
			</Card>
			<PostComments
				key={post.id}
				post={post}
				ref={commentsBottomSheetRef}
			/>
		</>
	);
}
