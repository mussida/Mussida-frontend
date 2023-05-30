export const singleTopNListItemQueryKey = ({
	entity,
	itemId,
}: {
	itemId: string;
	entity: string;
}) => ["profile", "topNList", entity, itemId];
