import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { PostsApi } from "spotifyApp-api-main-manager/dist/api";
import { instanceApi } from "../../../utils/api";
import {
	backendTokenAtom,
	spotifyTokenAtom,
} from "../../../utils/atoms/tokenAtoms";

export const getRecommendPostsQueryKey = ["posts", "recommended"];

export default function useGetRecommendedPosts() {
	const backendToken = useAtomValue(backendTokenAtom);
	const spotifyToken = useAtomValue(spotifyTokenAtom);

	return useQuery({
		queryKey: [...getRecommendPostsQueryKey],
		queryFn: () => {
			return instanceApi(
				PostsApi,
				backendToken ?? ""
			).queryPostsRouterGetRecommendedPost(spotifyToken ?? "");
		},
		enabled: backendToken !== null,
	});
}
