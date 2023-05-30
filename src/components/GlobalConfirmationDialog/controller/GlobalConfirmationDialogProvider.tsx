import BottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet";
import { atom, useAtom } from "jotai";
import { createContext, useContext, useRef, useState } from "react";
import { ConfirmationDialogProps } from "../../ConfirmationDialog/ConfirmationDialog";

function useInitGlobalConfirmationDialog() {
	const [titleAtom] = useState(atom<ConfirmationDialogProps["title"]>(""));
	const [descriptionAtom] = useState(
		atom<ConfirmationDialogProps["description"]>("")
	);
	const [positiveButtonAtom] = useState(
		atom<ConfirmationDialogProps["positiveButton"]>({
			text: "",
			onPress: () => {
				return Promise.resolve();
			},
			disabled: false,
		})
	);
	const [negativeButtonAtom] = useState(
		atom<ConfirmationDialogProps["negativeButton"]>({
			text: "",
			onPress: () => {},
			disabled: false,
		})
	);

	const confirmationDialogRef = useRef<BottomSheet>(null);

	return {
		titleAtom,
		descriptionAtom,
		confirmationDialogRef,
		positiveButtonAtom,
		negativeButtonAtom,
	};
}

type GlobalConfirmationDialogProviderProps = ReturnType<
	typeof useInitGlobalConfirmationDialog
>;

export const GlobalConfirmationDialogContext =
	createContext<GlobalConfirmationDialogProviderProps>(
		{} as GlobalConfirmationDialogProviderProps
	);

export const GlobalConfirmationDialogProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const value = useInitGlobalConfirmationDialog();
	return (
		<GlobalConfirmationDialogContext.Provider value={value}>
			{children}
		</GlobalConfirmationDialogContext.Provider>
	);
};

export const useGlobalConfirmationDialogContext = () => {
	const data = useContext(GlobalConfirmationDialogContext);
	if (!data)
		throw new Error(
			"useGlobalConfirmationDialogContext must be used within a GlobalConfirmationDialogProvider"
		);
	return data;
};
