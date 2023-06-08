import { Audio } from "expo-av";
import { atom } from "jotai";

export const audioAtom = atom<
	| { postId?: string; audio?: Audio.SoundObject; isPlaying?: boolean }
	| undefined
>(undefined);
