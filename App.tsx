import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import Toast from "react-native-toast-message";
import "react-native-reanimated";
import "react-native-gesture-handler";

import * as React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import {
  configureFonts,
  DefaultTheme,
  MD3DarkTheme,
  Provider,
} from "react-native-paper";
import { useAppTheme } from "react-native-paper/lib/typescript/core/theming";
import { black } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import {
  useFonts,
  NunitoSans_400Regular,
  NunitoSans_700Bold,
} from "@expo-google-fonts/nunito-sans";

import Login from "./src/pages/login/Login";
import SearchPage from "./src/pages/search/SearchPage";
import { spotifyTokenAtom } from "./src/utils/atoms/tokenAtoms";
import RootPage from "./src/pages/RootPage/RootPage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GlobalConfirmationDialogProvider } from "./src/components/GlobalConfirmationDialog/controller/GlobalConfirmationDialogProvider";
import GlobalConfirmationDialog from "./src/components/GlobalConfirmationDialog/GlobalConfirmationDialog";
import CreatePost from "./src/pages/CreatePost/CreatePost";
import BottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useExpoNotification } from "./src/hooks/useRegisterForNotifications";

// Create a client
const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    NunitoSans_400Regular,
    NunitoSans_700Bold,
  });

  const token = useAtomValue(spotifyTokenAtom);

  React.useEffect(() => {
    StatusBar.setBarStyle("light-content");
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider
        theme={{
          ...MD3DarkTheme,
          fonts: configureFonts({
            config: {
              fontFamily: "NunitoSans_400Regular",
            },
          }),
        }}
      >
        <GestureHandlerRootView style={{ width: "100%", height: "100%" }}>
          <GlobalConfirmationDialogProvider>
            <NavigationContainer theme={DarkTheme}>
              <BottomSheetModalProvider>
                <Stack.Navigator>
                  {token == null ? (
                    <Stack.Screen
                      options={{
                        header: () => null,
                      }}
                      name="Home"
                      component={Login}
                    />
                  ) : (
                    <>
                      <Stack.Screen
                        name="RootPage"
                        component={RootPage}
                        options={{
                          header: () => null,
                        }}
                      />
                      <Stack.Screen
                        name="CreatePost"
                        options={{ title: "Create post" }}
                        component={CreatePost}
                      />
                    </>
                  )}
                </Stack.Navigator>
              </BottomSheetModalProvider>
            </NavigationContainer>
            <GlobalConfirmationDialog />
          </GlobalConfirmationDialogProvider>
        </GestureHandlerRootView>
        <Toast />
      </Provider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
