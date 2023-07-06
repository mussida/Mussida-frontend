import { UsersApi } from "spotifyApp-api-main-manager/dist/api";
import { useApi } from "../utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryUserRouterReportItemRequest } from "spotifyApp-api-main-manager";
import { getRecommendPostsQueryKey } from "../components/Post/Hooks/useGetRecommendedPosts";

export function useReportItem() {
	const usersApi = useApi(UsersApi);
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (params: QueryUserRouterReportItemRequest) => {
			return usersApi.queryUserRouterReportItem(params);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(getRecommendPostsQueryKey);
		},
	});
}
