import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
	TouchableHighlight,
	useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { forwardRef, useCallback, useMemo } from "react";
import { Text, useTheme } from "react-native-paper";
import {
	useSafeAreaFrame,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useForwardedRef } from "../../hooks/useForwardedRef";
import { Octicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useConfirmationDialog } from "../GlobalConfirmationDialog/hooks/useConfirmationDialog";
import { useReportItem } from "../../hooks/useReportItem";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { QueryUserRouterReportItemRequest } from "spotifyApp-api-main-manager";

type ReportMenuProps = {
	instanceType: QueryUserRouterReportItemRequest["itemType"];
	instanceId: string;
};
const ReportMenu = forwardRef<BottomSheetModalMethods, ReportMenuProps>(
	({ instanceType, instanceId }, ref) => {
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

		const { showConfirmationDialog } = useConfirmationDialog();

		const reportItem = useReportItem();

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
				index={0}
			>
				<BottomSheetView
					onLayout={handleContentLayout}
					style={{
						padding: 7,
						paddingBottom: bottom,
						minHeight: height * 0.1,
					}}
				>
					<TouchableHighlight
						onPress={() => {
							bottomSheetRef.current?.close();
							showConfirmationDialog({
								title: `Report ${instanceType}`,
								description: `Are you sure you want to report this ${instanceType}?`,
								negativeButton: {
									text: "Cancel",
									onPress: () => {},
								},
								positiveButton: {
									text: "Report",
									onPress: () => {
										return reportItem
											.mutateAsync({
												id: instanceId,
												itemType: instanceType,
											})
											.catch((err) => {
												Toast.show({
													text1: "Error",
													text2:
														"Error while reporting " +
														instanceType,
													type: "error",
												});
											});
									},
								},
							});
						}}
					>
						<View
							style={{
								padding: 8,
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Octicons name="blocked" size={20} color="white" />
							<Text style={{ marginLeft: 8 }}>Report</Text>
						</View>
					</TouchableHighlight>
				</BottomSheetView>
			</BottomSheetModal>
		);
	}
);
export default ReportMenu;
