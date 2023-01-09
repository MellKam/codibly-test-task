import {
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

export const SearchParamsProvider: FC<{ children: ReactNode }> = (props) => {
	const [searchParams, setSearchParams] = useState(
		new URLSearchParams(location.search)
	);

	return (
		<SearchParamsContext.Provider
			value={{
				setSearchParams: (value) => {
					if (typeof value === "function") {
						setSearchParams((prev) => {
							const newValue = value(prev);
							let url = location.pathname;

							const search = newValue.toString();
							if (search.length) url += "?" + search;

							history.pushState(null, "", url);

							return newValue;
						});
						return;
					}

					setSearchParams(value);

					let url = location.pathname;

					const search = value.toString();
					if (search.length) url += "?" + search;

					history.pushState(null, "", url);
				},
				searchParams,
			}}
		>
			{props.children}
		</SearchParamsContext.Provider>
	);
};
