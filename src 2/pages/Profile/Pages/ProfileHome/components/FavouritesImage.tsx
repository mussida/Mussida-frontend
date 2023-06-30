import { useQuery } from "@tanstack/react-query";
import { spotifyApi } from "../../../../../utils/spotifyClients";
import { Image } from "react-native";

export default function FavouritesImage({
  imageId,
  variant,
}: {
  imageId: string;
  variant: "artists" | "songs";
}) {
  const { data } = useQuery({
    queryKey: ["favourite", imageId],
    queryFn: () => {
      if (variant === "artists") {
        return spotifyApi.getArtist(imageId).then((res) => {
          return res.body.images?.[0];
        });
      } else {
        return spotifyApi.getTrack(imageId).then((res) => {
          return res.body.album.images?.[0];
        });
      }
    },
  });
  return (
    <Image
      source={{
        uri: data?.url,
      }}
      style={{ width: 80, height: 80, borderRadius: 4, marginLeft: 4 }}
    ></Image>
  );
}
