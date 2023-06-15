import {
	AuthRequest,
	AuthRequestConfig,
	exchangeCodeAsync,
	makeRedirectUri,
	ResponseType,
} from "expo-auth-session";
import { generateRandom } from "expo-auth-session/build/PKCE";
import { useAtom } from "jotai";
import { UsersApi } from "spotifyApp-api-main-manager";
import { useApi } from "../utils/api";
import { backendTokenAtom, spotifyTokenAtom } from "../utils/atoms/tokenAtoms";
import { spotifyApi } from "../utils/spotifyClients";
import { Alert } from "react-native";

// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const clientId = "ff78f4e3584f4448a5385fe2f72e20cf";

export function useSpotifyLogin() {
  const [token, setToken] = useAtom(spotifyTokenAtom);
  const [backendToken, setBackendToken] = useAtom(backendTokenAtom);

  const usersApi = useApi(UsersApi);

  const login = async () => {
    try {
      const state = generateRandom(32);

      const redirectUrl = makeRedirectUri({
        useProxy: false,
        native: "mussida://redirect",
      });

      const authRequestOptions: AuthRequestConfig = {
        usePKCE: true,
        responseType: ResponseType.Code,
        clientId: clientId,
        scopes: [
          "user-read-email",
          "playlist-modify-public",
          "user-modify-playback-state",
          "streaming",
        ],
        redirectUri: redirectUrl,
        state: state,
      };

      const authRequest = new AuthRequest(authRequestOptions);

      const authorizeResult = await authRequest.promptAsync(discovery, {
        useProxy: false,
      });

      const { accessToken, refreshToken } = await exchangeCodeAsync(
        {
          //@ts-ignore
          code: authorizeResult.params.code,
          clientId: clientId,
          redirectUri: redirectUrl,
          extraParams: {
            code_verifier: authRequest.codeVerifier || "",
          },
        },
        discovery
      );

      spotifyApi.setAccessToken(accessToken);
      setToken(accessToken);
      if (refreshToken) spotifyApi.setRefreshToken(refreshToken);
      usersApi
        .queryUserRouterLogin({
          spotifyToken: accessToken,
        })
        .then((res) => {
          setBackendToken(res.data.token);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return { login };
}
