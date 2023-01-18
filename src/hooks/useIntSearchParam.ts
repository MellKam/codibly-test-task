import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useSearchParamsContext } from "../contexts/SearchParamsContext";

export const useIntSearchParam = (name: string, defaultValue: number) => {
	const { searchParams, setSearchParams } = useSearchParamsContext();

	const _defaultValue = useMemo(() => {
		const param = searchParams.get(name);
		if (param === null) {
			return defaultValue;
		}

		const parsedParam = parseInt(param);
		if (isNaN(parsedParam)) {
			return defaultValue;
		}

		return parsedParam;
	}, [searchParams, name, defaultValue]);

	const [param, _setParam] = useState(_defaultValue);

	useEffect(() => {
		const searchParam = searchParams.get(name);
		if (searchParam === null) {
			return;
		}

		const parsedParam = parseInt(searchParam);
		if (isNaN(parsedParam)) {
			setSearchParams((prev) => {
				prev.delete(name);
				return prev;
			});
			return;
		}

		if (param !== parsedParam) _setParam(parsedParam);
	}, [searchParams]);

	const setParam = useCallback<Dispatch<SetStateAction<number>>>(
		(value) => {
			if (typeof value === "function") {
				_setParam((prev) => {
					const newParam = value(prev);
					setSearchParams((prev) => {
						prev.set(name, newParam.toString());
						return prev;
					});
					return newParam;
				});
			}

			_setParam(value);
			setSearchParams((prev) => {
				prev.set(name, value.toString());
				return prev;
			});
		},
		[setSearchParams],
	);

	return [param, setParam] as const;
};
