const getOptionalText = (value: unknown) =>
  typeof value === "string" && value.trim().length ? value.trim() : undefined;

export const normalizeCollection = (collection: any) => {
  const description = getOptionalText(collection?.category?.description);

  return {
    id: collection?.id,
    category: {
      label: collection?.category?.label,
      ...(description ? { description } : {}),
    },
    minHotelVersion: collection?.minHotelVersion,
  };
};
