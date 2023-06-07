import { FontAwesome5 } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Audio } from "expo-av";
import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";
import {
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

export default function SinglePost({
	post,
}: {
	post: QueryPostsRouterGetRecommendedPost200ResponseInner;
}) {
	const theme = useTheme();
	const [audio, setAudio] = useState<Audio.SoundObject>();
	const [isPlaying, setIsPlaying] = useState(false);
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

	useEffect(() => {
		if (!track) return;
		Audio.Sound.createAsync({
			uri: track.body.preview_url ?? "",
		}).then((audio) => {
			setAudio(audio);
		});
	}, [track]);

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
				{audio && (
					<TouchableRipple
						onPress={async () => {
							setIsPlaying(!isPlaying);
							console.log(audio);
							if (isPlaying) {
								audio?.sound.pauseAsync();
							} else {
								audio?.sound.playAsync().then((res) => {
									console.log(res);
								});
							}
							audio?.sound.getStatusAsync().then((status) => {
								// console.log("SIUM:  ~ status:", status)
							});
						}}
						underlayColor={theme.colors.primary}
						style={{
							position: "absolute",
							shadowRadius: 12,
							shadowOpacity: 0.8,
						}}
					>
						{!isPlaying ? (
							<FontAwesome5 name="play" size={40} color="white" />
						) : (
							<FontAwesome5
								name="pause"
								size={40}
								color="white"
							/>
						)}
					</TouchableRipple>
				)}
			</View>
		</Card>
	);
}
