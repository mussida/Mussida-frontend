import { UsersApi } from "spotifyApp-api-main-manager/dist/api";
import { useApi } from "../../../utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Toast } from "react-native-toast-message/lib/src/Toast";

export function useIsFollowing(userId: string) {
	const usersApi = useApi(UsersApi);
	return useQuery({
		queryKey: ["isFollowing", userId],
		queryFn: () => usersApi.queryUserRouterIsFollowing(userId),
		onError: () => {
			Toast.show({
				text1: "Error",
				text2: "Cannot load user data",
				type: "error",
			});
		},
	});
}

export function useToggleFollowUser({
	isFollowing,
	userId,
}: {
	isFollowing: boolean;
	userId: string;
}) {
	const usersApi = useApi(UsersApi);
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => {
			return isFollowing
				? usersApi.queryUserRouterUnfollowUser({ id: userId })
				: usersApi.queryUserRouterFollowUser({ id: userId });
		},
		onSuccess: () => {
			queryClient.setQueryData(["isFollowing", userId], !isFollowing);
			queryClient.invalidateQueries(["isFollowing", userId]);
		},
		onError: () => {
			Toast.show({
				text1: "Error",
				text2: "Cannot follow user",
				type: "error",
			});
		},
	});
}
