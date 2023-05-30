import { useSetAtom } from "jotai";
import { ConfirmationDialogProps } from "../../ConfirmationDialog/ConfirmationDialog";
import { useGlobalConfirmationDialogContext } from "../controller/GlobalConfirmationDialogProvider";

export function useConfirmationDialog() {
	const {
		descriptionAtom,
		titleAtom,
		confirmationDialogRef,
		negativeButtonAtom,
		positiveButtonAtom,
	} = useGlobalConfirmationDialogContext();
	const setTitle = useSetAtom(titleAtom);
	const setDescription = useSetAtom(descriptionAtom);
	const setNegativeButton = useSetAtom(negativeButtonAtom);
	const setPositiveButton = useSetAtom(positiveButtonAtom);

	const showConfirmationDialog = ({
		title,
		description,
		negativeButton,
		positiveButton,
	}: ConfirmationDialogProps) => {
		setTitle(title);
		setDescription(description);
		setNegativeButton(negativeButton);
		setPositiveButton(positiveButton);
		confirmationDialogRef.current?.expand();
	};

	return {
		showConfirmationDialog,
	};
}
