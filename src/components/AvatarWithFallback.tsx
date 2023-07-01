import { Avatar, AvatarImageProps, Text } from "react-native-paper";

type AvatarWithFallbackProps = {
	uri?: string;
} & Omit<AvatarImageProps, "source" | "theme">;
const AvatarWithFallback: React.FC<AvatarWithFallbackProps> = ({
	uri,
	...props
}) => {
	return uri ? (
		<Avatar.Image
			{...props}
			source={{
				uri: uri,
			}}
		/>
	) : (
		<Avatar.Text {...props} label="" />
	);
};
export default AvatarWithFallback;
