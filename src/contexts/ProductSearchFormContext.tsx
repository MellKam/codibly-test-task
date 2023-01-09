import {
	createContext,
	Dispatch,
	SetStateAction,
	FC,
	ReactNode,
	useMemo,
	useState,
	useEffect,
	useContext,
} from "react";
import { useSearchParamsContext } from "./SearchParamsContext";

export interface ProductSearchFormData {
	id: number | null;
}

const ProductSearchFormContext = createContext<{
	formData: ProductSearchFormData;
	setFormData: Dispatch<SetStateAction<ProductSearchFormData>>;
	defaultValues: ProductSearchFormData;
} | null>(null);

export const ProductSearchFormProvider: FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { searchParams, setSearchParams } = useSearchParamsContext();

	const defaultValues = useMemo((): ProductSearchFormData => {
		const id = searchParams.get("id");
		return { id: id ? parseInt(id) : null };
	}, [searchParams]);

	const [formData, setFormData] =
		useState<ProductSearchFormData>(defaultValues);

	useEffect(() => {
		const id = searchParams.get("id");

		if (id) {
			const numberId = parseInt(id);
			if (isNaN(numberId)) {
				setSearchParams((prev) => {
					prev.delete("id");
					return prev;
				});
				return;
			}
			if (numberId === formData.id) {
				return;
			}

			setFormData({ id: numberId });
		}
	}, [searchParams]);

	useEffect(() => {
		formData.id === null
			? setSearchParams((prev) => {
					prev.delete("id");
					return prev;
			  })
			: setSearchParams((prev) => {
					prev.set("id", formData.id!.toString());
					return prev;
			  });
	}, [formData]);

	return (
		<ProductSearchFormContext.Provider
			value={{ formData, setFormData, defaultValues }}
		>
			{children}
		</ProductSearchFormContext.Provider>
	);
};

export const useProductSearchFormContext = () => {
	const data = useContext(ProductSearchFormContext);

	if (data === null) {
		throw new Error("Cannot get ProductSearchFormContext");
	}

	return data;
};
