import { Ionicons } from "@expo/vector-icons";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, IconButton, TextInput } from "react-native-paper";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import {
	PostsApi,
	QueryPostsRouterGetRecommendedPost200ResponseInner,
} from "spotifyApp-api-main-manager";
import { useApi } from "../../../utils/api";
import { getRecommendPostsQueryKey } from "../Hooks/useGetRecommendedPosts";

type PostCommentFooterProps = {
	post: QueryPostsRouterGetRecommendedPost200ResponseInner;
};
const PostCommentFooter: React.FC<PostCommentFooterProps> = ({ post }) => {
	const [newComment, setNewComment] = useState("");
	const postApi = useApi(PostsApi);
	const queryClient = useQueryClient();
	const createCommentMutation = useMutation({
		mutationFn: (comment: string) =>
			postApi.queryPostsRouterCommentPost({
				comment,
				postId: post.id,
			}),
		onSuccess: (data) => {
			setNewComment("");
			queryClient.setQueryData<
				Awaited<
					ReturnType<PostsApi["queryPostsRouterGetRecommendedPost"]>
				>
			>(getRecommendPostsQueryKey, (oldData) => {
				if (!oldData) return oldData;
				return {
					...oldData,
					data: oldData.data.map((p) => {
						if (p.id === post.id) {
							return {
								...p,
								comments: [...p.comments, { ...data.data }],
							};
						}
						return p;
					}),
				};
			});
		},
		onError: (err) => {
			Toast.show({
				text1: "Error",
				text2: "Could not create comment",
			});
		},
	});
	return (
		// <BottomSheetFooter {...props}>
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				width: "100%",
				height: 58,
			}}
		>
			<TextInput
				mode="outlined"
				placeholder="Add comment"
				style={{ flex: 1 }}
				value={newComment}
				onChangeText={setNewComment}
				disabled={createCommentMutation.isLoading}
				render={({ ref, ...props }) => (
					<BottomSheetTextInput {...props} />
				)}
			/>
			<IconButton
				style={{ marginLeft: 8 }}
				onPress={() => {
					createCommentMutation.mutate(newComment);
				}}
				mode="contained"
				disabled={createCommentMutation.isLoading}
				icon={({ ...props }) =>
					createCommentMutation.isLoading ? (
						<ActivityIndicator />
					) : (
						<Ionicons name="ios-send" {...props} />
					)
				}
			/>
		</View>
		// </BottomSheetFooter>
	);
};
export default PostCommentFooter;
