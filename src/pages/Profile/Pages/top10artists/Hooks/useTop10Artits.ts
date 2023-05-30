import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../../../../utils/api";
import { UsersApi } from "spotifyApp-api-main-manager";
export const top10ArtistQueryKey = ["profile", "top10Artists"];
export type Top10ArtistRes = ReturnType<typeof useTop10Artists>["data"];

export default function useTop10Artists() {
  const usersApi = useApi(UsersApi);
  return useQuery({
    queryKey: top10ArtistQueryKey,
    queryFn: () => {
      return usersApi.queryUserRouterGetUser().then((res) => {
        return { ...res, data: res.data.top10Artists };
      });
    },
  });
}
