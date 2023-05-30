import { useQuery } from "@tanstack/react-query";
import { genres } from "../../../../../utils/constants/genres";
import { useApi } from "../../../../../utils/api";
import { UsersApi } from "spotifyApp-api-main-manager";

export function useFavoutiteGenres() {
  const usersApi = useApi(UsersApi);
  return useQuery({
    queryKey: ["profile", "favouriteGenres"],
    queryFn: () => {
      return usersApi.queryUserRouterGetUser().then((res) => {
        return { ...res, data: res.data.favouriteGenres };
      });
    },
  });
}
