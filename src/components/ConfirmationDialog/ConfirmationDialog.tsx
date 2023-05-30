import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { View } from "moti";
import { forwardRef, useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Button, Text, useTheme } from "react-native-paper";
import { useForwardedRef } from "../../hooks/useForwardedRef";
import { fontVariant } from "../../utils/fonts/fontVariant";

export type ConfirmationDialogProps = {
  title: string;
  description: string;
  negativeButton: { text: string; onPress: () => void; disabled?: boolean };
  positiveButton: {
    text: string;
    onPress: () => Promise<any>;
    disabled?: boolean;
  };
};

const ConfirmationDialog = forwardRef<
  BottomSheetMethods,
  ConfirmationDialogProps
>(({ title, description, positiveButton, negativeButton }, ref) => {
  const bottomSheetRef = useForwardedRef(ref);
  const theme = useTheme();

  const [isLoadingPositiveAction, setIsLoadingPositiveAction] = useState(false);

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
    <BottomSheet
      backdropComponent={renderBackdrop}
      style={{ zIndex: 100 }}
      backgroundStyle={{ backgroundColor: theme.colors.background }}
      enablePanDownToClose={!isLoadingPositiveAction}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.onBackground,
      }}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      ref={bottomSheetRef}
      index={-1}
    >
      <BottomSheetView onLayout={handleContentLayout} style={{ padding: 16 }}>
        <Text
          variant="headlineLarge"
          style={{ fontFamily: fontVariant.bold, paddingBottom: 12 }}
        >
          {title}
        </Text>
        <Text variant="bodyLarge" style={{ paddingBottom: 32 }}>
          {description}{" "}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingBottom: 32,
          }}
        >
          <Button
            onPress={() => {
              negativeButton.onPress();
              bottomSheetRef.current?.close();
            }}
            disabled={negativeButton.disabled || isLoadingPositiveAction}
            mode={"text"}
          >
            {negativeButton.text}
          </Button>
          <Button
            onPress={async () => {
              setIsLoadingPositiveAction(true);
              await positiveButton.onPress();
              setIsLoadingPositiveAction(false);
              bottomSheetRef.current?.close();
            }}
            disabled={positiveButton.disabled || isLoadingPositiveAction}
            mode={"contained"}
          >
            {positiveButton.text}
            {isLoadingPositiveAction && (
              <ActivityIndicator animating={true} size={"small"} />
            )}
          </Button>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});
export default ConfirmationDialog;
