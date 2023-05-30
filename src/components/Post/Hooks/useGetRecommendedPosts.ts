import { PostsApi } from "spotifyApp-api-main-manager/dist/api";
import { useApi } from "../../../utils/api";
import { useQuery } from "@tanstack/react-query";

export const getRecommendPostsQueryKey = ["posts", "recommended"];

export default function useGetRecommendedPosts() {
  const postsApi = useApi(PostsApi);
  return useQuery({
    queryKey: getRecommendPostsQueryKey,
    queryFn: () => {
      return postsApi.queryPostsRouterGetRecommendedPost();
    },
  });
}
