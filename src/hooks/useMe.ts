import { useQuery } from "@tanstack/react-query";
import { spotifyApi } from "../utils/spotifyClients";
import { useApi } from "../utils/api";
import { UsersApi } from "spotifyApp-api-main-manager/dist/api";

export function useMe() {
	return useQuery({
		queryKey: ["me"],
		queryFn: () => {
			return spotifyApi.getMe();
		},
	});
}
export function useUser() {
	const usersApi = useApi(UsersApi);
	return useQuery({
		queryKey: ["me", "user"],
		queryFn: () => {
			return usersApi.queryUserRouterGetUser();
		},
		staleTime: 1000 * 60 * 5,
	});
}
