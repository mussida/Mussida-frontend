//@ts-nocheck
import SpotifyWebApi from "spotify-web-api-node";
import SpotifyWebApiServer from "spotify-web-api-node/src/server-methods";
(
  SpotifyWebApi as unknown as { _addMethods: (fncs: unknown) => void }
)._addMethods(SpotifyWebApiServer);

export const spotifyApi = new SpotifyWebApi({
  redirectUri: "exp://192.168.10.104:19000",
  clientId: "ff78f4e3584f4448a5385fe2f72e20cf",
});
