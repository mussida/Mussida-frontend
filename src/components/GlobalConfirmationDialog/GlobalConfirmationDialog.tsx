import { useAtomValue } from "jotai";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import { useGlobalConfirmationDialogContext } from "./controller/GlobalConfirmationDialogProvider";

const GlobalConfirmationDialog = () => {
	const {
		titleAtom,
		descriptionAtom,
		confirmationDialogRef,
		negativeButtonAtom,
		positiveButtonAtom,
	} = useGlobalConfirmationDialogContext();

	const title = useAtomValue(titleAtom);
	const description = useAtomValue(descriptionAtom);
	const negativeButton = useAtomValue(negativeButtonAtom);
	const positiveButton = useAtomValue(positiveButtonAtom);

	return (
		<ConfirmationDialog
			title={title}
			description={description}
			negativeButton={negativeButton}
			ref={confirmationDialogRef}
			positiveButton={positiveButton}
		/>
	);
};
export default GlobalConfirmationDialog;
