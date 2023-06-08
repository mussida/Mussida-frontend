import { ScrollView, View } from "react-native";
import { TouchableRipple, useTheme, Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMe } from "../../../../../hooks/useMe";
import { useQuery } from "@tanstack/react-query";
import { UsersApi } from "spotifyApp-api-main-manager/dist/api";
import { useApi } from "../../../../../utils/api";
import FavouritesImage from "./FavouritesImage";

interface favouritesButtonProps {
	text: string;
	path: string;
	variant: "artists" | "songs";
}
//functional component of react
const FavouritesButton: React.FC<favouritesButtonProps> = ({
	text,
	path,
	variant,
}) => {
	const theme = useTheme();
	const usersApi = useApi(UsersApi);
	const { data } = useQuery({
		queryKey: ["profile"],
		queryFn: () => {
			return usersApi.queryUserRouterGetUser();
		},
	});

	const navigation = useNavigation();
	return (
		<TouchableRipple
			//@ts-ignore
			onPress={() => navigation.navigate(path)}
			underlayColor={theme.colors.primary}
		>
			<View style={{ padding: 12 }}>
				<View
					style={{
						paddingBottom: 4,
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Text variant="titleMedium">{text}</Text>
					<MaterialIcons
						name="keyboard-arrow-right"
						size={24}
						color="white"
					/>
				</View>
				<ScrollView
					horizontal
					style={{ flexDirection: "row", zIndex: 100 }}
				>
					{(variant === "artists"
						? data?.data.top10Artists
						: data?.data.top10Songs
					)?.map((item) => {
						return (
							<FavouritesImage
								key={item}
								imageId={item}
								variant={variant}
							></FavouritesImage>
						);
					})}
				</ScrollView>
			</View>
		</TouchableRipple>
	);
};
export default FavouritesButton;
