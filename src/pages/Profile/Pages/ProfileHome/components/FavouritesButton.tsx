import { View } from "react-native";
import { TouchableRipple, useTheme, Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface favouritesButtonProps {
  text: string;
  path: string;
}
//functional component of react
const FavouritesButton: React.FC<favouritesButtonProps> = ({ text, path }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  return (
    <TouchableRipple
      //@ts-ignore
      onPress={() => navigation.navigate(path)}
      underlayColor={theme.colors.primary}
    >
      <View
        style={{
          padding: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text variant="titleMedium">{text}</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="white" />
      </View>
    </TouchableRipple>
  );
};
export default FavouritesButton;
