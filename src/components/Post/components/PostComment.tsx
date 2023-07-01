import { TouchableWithoutFeedback } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { QueryPostsRouterGetRecommendedPost200ResponseInner } from "spotifyApp-api-main-manager";
import { useUser } from "../../../hooks/useMe";
import { fontVariant } from "../../../utils/fonts/fontVariant";
import { spotifyApi } from "../../../utils/spotifyClients";
import AvatarWithFallback from "../../AvatarWithFallback";

type PostCommentProps = {
	comment: QueryPostsRouterGetRecommendedPost200ResponseInner["comments"][number];
	hideBottomSheet: () => void;
};
const PostComment: React.FC<PostCommentProps> = ({
	comment,
	hideBottomSheet,
}) => {
	const { data: user, isLoading: isLoadingUser } = useQuery({
		queryKey: ["post", "comment", "user", comment.createdById],
		queryFn: () => {
			return spotifyApi.getUser(comment.createdById);
		},
	});
	const { data: me } = useUser();

	const navigation = useNavigation();
	const onTapUser = () => {
		hideBottomSheet();
		comment.createdById === me?.data.id
			? //@ts-expect-error
			  navigation.navigate("Profile")
			: //@ts-expect-error
			  navigation.navigate("FriendProfile", {
					userId: comment.createdById,
			  });
	};

	return (
		<View style={{ flexDirection: "row", marginBottom: 8 }}>
			{isLoadingUser ? (
				<Text>Loading...</Text>
			) : (
				<>
					<TouchableWithoutFeedback onPress={onTapUser}>
						<AvatarWithFallback
							size={36}
							style={{ marginRight: 12, marginTop: 4 }}
							uri={user?.body.images?.[0]?.url ?? ""}
						/>
					</TouchableWithoutFeedback>
					<View>
						<TouchableWithoutFeedback onPress={onTapUser}>
							<Text style={{ fontFamily: fontVariant.bold }}>
								{user?.body.display_name ?? "Unknown"}
							</Text>
						</TouchableWithoutFeedback>
						<Text style={{ marginTop: 4 }} variant="bodyLarge">
							{comment.text}
						</Text>
					</View>
				</>
			)}
		</View>
	);
};
export default PostComment;
