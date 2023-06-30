import { useThrottle } from "@react-hook/throttle";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { spotifyApi } from "../../utils/spotifyClients";

const SearchPage = () => {
	const [searchInput, setSearchInput] = useState("");
	const [throttledSearchInput, setThrottledSearchInput] = useThrottle("");

	const { data } = useQuery({
		queryKey: ["search", throttledSearchInput],
		queryFn: () => spotifyApi.searchTracks(throttledSearchInput),
		onError: () => {
			console.log("error");
		},
	});

	data?.body?.tracks?.items?.forEach((track) => {
		console.log(track.name);
	});

	return (
		<TextInput
			style={[styles.searchBar]}
			placeholder="Cerca la canzone"
			value={searchInput}
			onChangeText={(text) => {
				setSearchInput(text);
				setThrottledSearchInput(text);
			}}
		/>
	);
};

const styles = StyleSheet.create({
	searchBar: {
		width: "100%",
	},
});

export default SearchPage;
