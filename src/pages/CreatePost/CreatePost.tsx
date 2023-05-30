import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NormalFormPost from "../../components/Post/NormalFormPost";

export default function CreatePost() {
	const { bottom } = useSafeAreaInsets();

	return (
		<View
			style={{
				height: "100%",
				width: "100%",
				paddingTop: 0,
				marginTop: 0,
				justifyContent: "space-between",
				paddingBottom: bottom,
			}}
		>
			<NormalFormPost />
		</View>
	);
}
