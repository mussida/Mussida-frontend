import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UsersApi } from "spotifyApp-api-main-manager";
import TopNList from "../../../../components/TopNList/TopNList";
import { useApi } from "../../../../utils/api";
import { Response } from "../../../../utils/interfaces/Response";
import { spotifyApi } from "../../../../utils/spotifyClients";

export default function Top10Songs() {
	const queryClient = useQueryClient();
	const usersApi = useApi(UsersApi);
	const { data: top10Songs, isLoading: isLoadingTop10Songs } = useQuery({
		queryKey: ["profile", "top10Songs"],
		queryFn: () => {
			return usersApi.queryUserRouterGetUser().then((res) => {
				return { ...res, data: res.data.top10Songs };
			});
		},
	});

	return (
		<TopNList
			data={top10Songs?.data ?? []}
			isLoadingData={isLoadingTop10Songs}
			entityName="song"
			extractItems={(data) => {
				return (
					data?.tracks?.items.map((item) => {
						return {
							name: item.name,
							images: item.album.images,
							id: item.id,
						};
					}) ?? []
				);
			}}
			maxLenght={10}
			fetchItem={function (
				id: string
			): Promise<{ images: SpotifyApi.ImageObject[]; name: string }> {
				return spotifyApi.getTrack(id).then((res) => {
					return {
						images: res.body.album.images,
						name: res.body.name,
					};
				});
			}}
			onDeleteItem={function (id: string): Promise<any> {
				return usersApi.queryUserRouterEditTop10Songs({
					top10Songs: (top10Songs?.data ?? []).filter((value) => {
						return value !== id;
					}),
				});
			}}
			onDeleteSuccess={function (id: string): void {
				queryClient.setQueryData<typeof top10Songs>(
					["profile", "top10Songs"],
					(old) => {
						if (!old) return old;
						return {
							...old,
							data: old.data.filter((value) => {
								return value !== id;
							}),
						};
					}
				);
			}}
			searchEntity={function (
				searchInput: string
			): Promise<Response<SpotifyApi.SearchResponse>> {
				return spotifyApi.searchTracks(searchInput);
			}}
			onAddItem={function (item: {
				name: string;
				images: SpotifyApi.ImageObject[];
				id: string;
			}): Promise<any> {
				return usersApi.queryUserRouterEditTop10Songs({
					top10Songs: [...(top10Songs?.data ?? []), item.id],
				});
			}}
			onOptimisticAddItem={function (item: {
				name: string;
				images: SpotifyApi.ImageObject[];
				id: string;
			}): void {
				queryClient.setQueryData<typeof top10Songs>(
					["profile", "top10Songs"],
					(old) => {
						if (!old) return old;
						return { ...old, data: [...old.data, item.id] };
					}
				);
			}}
			revalidateItems={function (): void {
				queryClient.invalidateQueries(["profile", "top10Songs"]);
				queryClient.invalidateQueries(["profile"]);
			}}
		/>
	);
}
