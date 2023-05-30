import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../../../../utils/api";
import { UsersApi } from "spotifyApp-api-main-manager";
import { spotifyApi } from "../../../../../utils/spotifyClients";
export const singleArtistQueryKey = (artistId: string) => [
  "profile",
  "top10Artists",
  artistId,
];
export default function useSingleArtist(artistId: string) {
  const usersApi = useApi(UsersApi);
  return useQuery({
    queryKey: singleArtistQueryKey(artistId),
    queryFn: () => {
      return spotifyApi.getArtist(artistId);
    },
  });
}
