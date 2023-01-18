import {
	useCallback,
	createContext,
	Dispatch,
	FC,
	ReactNode,
	SetStateAction,
	useState,
	useContext,
} from "react";

const SearchParamsContext = createContext<{
	searchParams: URLSearchParams;
	setSearchParams: Dispatch<SetStateAction<URLSearchParams>>;
} | null>(null);

export const useSearchParamsContext = () => {
	const data = useContext(SearchParamsContext);

	if (data === null) {
		throw new Error("Cannot get SearchParamsContext");
	}

	return data;
};

const setSearchParamsToURL = (searchParams: URLSearchParams) => {
	let url = location.pathname;

	const searchString = searchParams.toString();
	if (searchString.length !== 0) url += "?" + searchString;

	history.pushState(null, "", url);
};

export const SearchParamsProvider: FC<{ children: ReactNode }> = (props) => {
	const [searchParams, _setSearchParams] = useState(
		new URLSearchParams(location.search),
	);

	const setSearchParams = useCallback<
		Dispatch<SetStateAction<URLSearchParams>>
	>(
		(value) => {
			if (typeof value === "function") {
				_setSearchParams((prev) => {
					const newSearchParams = value(prev);
					setSearchParamsToURL(newSearchParams);

					return newSearchParams;
				});
				return;
			}

			_setSearchParams(value);
			setSearchParamsToURL(value);
		},
		[_setSearchParams],
	);

	return (
		<SearchParamsContext.Provider
			value={{
				setSearchParams,
				searchParams,
			}}
		>
			{props.children}
		</SearchParamsContext.Provider>
	);
};
