import { Feather } from "@expo/vector-icons";
import {
	BottomSheetModal,
	TouchableWithoutFeedback,
} from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { QueryPostsRouterGetRecommendedPost200ResponseInner } from "spotifyApp-api-main-manager";
import { useUser } from "../../../hooks/useMe";
import { fontVariant } from "../../../utils/fonts/fontVariant";
import { spotifyApi } from "../../../utils/spotifyClients";
import AvatarWithFallback from "../../AvatarWithFallback";
import ReportMenu from "../../ReportMenu/ReportMenu";

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
	const reportBottomSheet = useRef<BottomSheetModal>(null);

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
					<View
						style={{
							flex: 1,
						}}
					>
						<TouchableWithoutFeedback onPress={onTapUser}>
							<Text style={{ fontFamily: fontVariant.bold }}>
								{user?.body.display_name ?? "Unknown"}
							</Text>
						</TouchableWithoutFeedback>
						<Text style={{ marginTop: 4 }} variant="bodyLarge">
							{comment.text}
						</Text>
					</View>
					<IconButton
						onPress={() => {
							// hideBottomSheet();
							reportBottomSheet.current?.present();
						}}
						style={{
							position: "absolute",
							top: 0,
							right: 0,
						}}
						size={20}
						icon={(props) => {
							return <Feather name="more-vertical" {...props} />;
						}}
					></IconButton>
					<ReportMenu
						ref={reportBottomSheet}
						instanceId={comment.id}
						instanceType="comment"
					/>
				</>
			)}
		</View>
	);
};
export default PostComment;
