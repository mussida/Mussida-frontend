import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Image, View } from "react-native";
import { Avatar, Button, Card, Chip, Text } from "react-native-paper";
import {
	QueryPostsRouterCreateNormalPost200Response,
	QueryPostsRouterGetRecommendedPost200ResponseInner,
} from "spotifyApp-api-main-manager";
import { getRecommendPostsQueryKey } from "./Hooks/useGetRecommendedPosts";
import { spotifyApi } from "../../utils/spotifyClients";
import { fontVariant } from "../../utils/fonts/fontVariant";

export default function SinglePost({
	post,
}: {
	post: QueryPostsRouterGetRecommendedPost200ResponseInner;
}) {
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
			<Image
				style={{
					width: "100%",
					// height: 200,
					marginTop: 12,
					borderRadius: 8,
					aspectRatio: 1,
				}}
				source={{
					uri: track?.body.album.images[0]?.url ?? "",
				}}
			/>
		</Card>
	);
}
