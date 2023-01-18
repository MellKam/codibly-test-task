export const newURLFromParams = <T extends Record<string, any>>(
	baseURL: string,
	searchParamsObj?: T,
): URL => {
	const url = new URL(baseURL);

	if (searchParamsObj != null) {
		Object.keys(searchParamsObj).forEach((key) => {
			url.searchParams.set(key, searchParamsObj[key].toString());
		});
	}

	return url;
};
