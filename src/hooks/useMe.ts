import { useQuery } from "@tanstack/react-query";
import { spotifyApi } from "../utils/spotifyClients";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => {
      return spotifyApi.getMe();
    },
  });
}
