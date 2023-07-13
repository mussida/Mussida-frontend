import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { PostsApi } from "spotifyApp-api-main-manager/dist/api";
import { instanceApi } from "../../../utils/api";
import {
	backendTokenAtom,
	spotifyTokenAtom,
} from "../../../utils/atoms/tokenAtoms";

export const getRecommendPostsQueryKey = ["posts", "recommended"];

const PER_PAGE = 10;

export default function useGetRecommendedPosts() {
	const backendToken = useAtomValue(backendTokenAtom);
	const spotifyToken = useAtomValue(spotifyTokenAtom);

	return useInfiniteQuery({
		queryKey: [...getRecommendPostsQueryKey],
		queryFn: ({ pageParam = 0 }) => {
			return instanceApi(
				PostsApi,
				backendToken ?? ""
			).queryPostsRouterGetRecommendedPost(
				spotifyToken ?? "",
				pageParam,
				PER_PAGE
			);
		},
		getNextPageParam: (lastPage, allPages) => {
			if (allPages.length * PER_PAGE < lastPage.data.totalCount)
				return allPages.length;
			return undefined;
		},
		enabled: backendToken !== null,
	});
}
