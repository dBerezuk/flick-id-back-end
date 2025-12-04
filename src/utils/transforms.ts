export const getValueTrimTransform = (value: string | null) => {
	return value?.trim();
};

export const getArrayTransform = (value: number | string) => {
	return value || (typeof value === 'number' && isNaN(value))
		? Array.isArray(value)
			? value
			: [value]
		: [];
};
