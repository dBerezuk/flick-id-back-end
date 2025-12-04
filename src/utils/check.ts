interface IGetIsHasMoreCheck {
	skip: number;
	take: number;
	count: number;
}

export const getIsHasMoreCheck = ({ skip, take, count }: IGetIsHasMoreCheck): boolean => {
	return count > skip + take;
};
