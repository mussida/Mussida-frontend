import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { UsersApi } from "spotifyApp-api-main-manager/dist/api";
import { useApi } from "../utils/api";
import { useAtomValue } from "jotai";
import { backendTokenAtom } from "../utils/atoms/tokenAtoms";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
async function registerForPushNotificationsAsync() {
  let token;
  if (true) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export function useExpoNotification() {
  
  const usersApi = useApi(UsersApi)
  const token = useAtomValue(backendTokenAtom)

  const hasRegisteredTokenRef = useRef(false)

  useEffect(() => {
    if(hasRegisteredTokenRef.current || !token) return
    registerForPushNotificationsAsync().then(async (token) => {
      hasRegisteredTokenRef.current = true
      if(token){
        await usersApi.queryUserRouterUpdateExpoToken({expoToken: token})
      }
    }).catch((err) => {
      Toast.show({
        text1: "Error",
        text2: "Error while registering for notifications",
        type: "error",
      })
    })
  }, [token]);
}
