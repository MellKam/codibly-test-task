export const delay = async <T>(
	handler: () => Promise<T> | T,
	delay: number,
) => {
	return await new Promise<T>((resolve, _reject) => {
		setTimeout(async () => {
			resolve(await handler());
		}, delay);
	});
};
