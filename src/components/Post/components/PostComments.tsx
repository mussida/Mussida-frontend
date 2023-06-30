import {
	BottomSheetBackdrop,
	BottomSheetFooter,
	BottomSheetModal,
	BottomSheetVirtualizedList,
	useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo } from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import {
	useSafeAreaFrame,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { QueryPostsRouterGetRecommendedPost200ResponseInner } from "spotifyApp-api-main-manager";
import { useForwardedRef } from "../../../hooks/useForwardedRef";
import PostComment from "./PostComment";
import PostCommentFooter from "./PostCommentFooter";

type Comment =
	QueryPostsRouterGetRecommendedPost200ResponseInner["comments"][number];

type PostCommentsProps = {
	post: QueryPostsRouterGetRecommendedPost200ResponseInner;
};
const PostComments = forwardRef<BottomSheetModal, PostCommentsProps>(
	({ post }, ref) => {
		const bottomSheetRef = useForwardedRef(ref);
		const { bottom } = useSafeAreaInsets();
		const { height } = useSafeAreaFrame();
		const theme = useTheme();

		const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);
		const renderBackdrop = useCallback(
			(props: any) => (
				<BottomSheetBackdrop
					{...props}
					opacity={0.38}
					enableTouchThrough={false}
					disappearsOnIndex={-1}
					appearsOnIndex={0}
				/>
			),
			[]
		);

		const {
			animatedHandleHeight,
			animatedSnapPoints,
			animatedContentHeight,
			handleContentLayout,
		} = useBottomSheetDynamicSnapPoints(initialSnapPoints);

		return (
			<BottomSheetModal
				backdropComponent={renderBackdrop}
				style={{ zIndex: 100 }}
				backgroundStyle={{
					backgroundColor: theme.colors.background,
				}}
				enablePanDownToClose
				handleIndicatorStyle={{
					backgroundColor: theme.colors.onBackground,
				}}
				snapPoints={animatedSnapPoints}
				handleHeight={animatedHandleHeight}
				contentHeight={animatedContentHeight}
				ref={bottomSheetRef}
				footerComponent={(props) => {
					return (
						<BottomSheetFooter
							style={{
								padding: 12,
								paddingTop: 0,
								paddingBottom: bottom,
								backgroundColor: theme.colors.background,
							}}
							{...props}
						>
							<PostCommentFooter post={post} />
						</BottomSheetFooter>
					);
				}}
				index={0}
			>
				<BottomSheetVirtualizedList
					ListEmptyComponent={() => {
						return (
							<View
								style={{
									alignItems: "center",
									justifyContent: "center",
									height: 200,
								}}
							>
								<Text variant="headlineSmall">
									No comments yet
								</Text>
							</View>
						);
					}}
					onLayout={handleContentLayout}
					style={{
						maxHeight: height * 0.8,
					}}
					contentContainerStyle={{
						padding: 12,
						paddingBottom: 60 + bottom,
						paddingTop: 0,
					}}
					data={post.comments}
					getItemCount={() => post.comments.length}
					getItem={(data, index) => {
						return data[index];
					}}
					keyExtractor={(comment: Comment) => comment.id}
					renderItem={(comment) => {
						return (
							<PostComment
								hideBottomSheet={() => {
									bottomSheetRef.current?.dismiss();
								}}
								key={comment.item.id}
								comment={comment.item}
							/>
						);
					}}
				/>
			</BottomSheetModal>
		);
	}
);
export default PostComments;
