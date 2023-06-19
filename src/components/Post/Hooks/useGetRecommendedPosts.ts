import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { PostsApi } from "spotifyApp-api-main-manager/dist/api";
import { instanceApi } from "../../../utils/api";
import { backendTokenAtom } from "../../../utils/atoms/tokenAtoms";

export const getRecommendPostsQueryKey = ["posts", "recommended"];

export default function useGetRecommendedPosts() {
  const token = useAtomValue(backendTokenAtom);

  return useQuery({
    queryKey: [...getRecommendPostsQueryKey],
    queryFn: () => {
      return instanceApi(
        PostsApi,
        token ?? ""
      ).queryPostsRouterGetRecommendedPost();
    },
    enabled: token !== null,
  });
}
