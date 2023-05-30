//@ts-nocheck
import { useAtomValue } from "jotai";
import "react-native-url-polyfill/auto";
import { backendTokenAtom } from "./atoms/tokenAtoms";
const BACKEND_API_BASENAME = "https://backendmussida-fwaxwt562a-oc.a.run.app";

export function useApi<T>(apiConstructor: T) {
  const backendToken = useAtomValue(backendTokenAtom);
  const instance: InstanceType<T> = new apiConstructor({
    basePath: `${BACKEND_API_BASENAME}/api`,
    baseOptions: {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${backendToken}`,
      },
    },
  });

  return instance;
}
