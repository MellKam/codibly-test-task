import { TextField } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
	ProductSearchFormData,
	useProductSearchFormContext,
} from "../contexts/ProductSearchFormContext";
import { useDebounce } from "../hooks/useDebounce";

export const ProductSearchInput = () => {
	const { defaultValues, setFormData } = useProductSearchFormContext();

	const debounceHandler = useDebounce(setFormData, 200, [setFormData]);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<ProductSearchFormData>({
		defaultValues,
	});

	useEffect(() => {
		const subscription = watch(handleSubmit(debounceHandler) as any);

		return () => subscription.unsubscribe();
	}, [handleSubmit, watch]);

	return (
		<TextField
			{...register("id", {
				validate: (data) => {
					if (data === null) {
						return true;
					}
					if (data === 0) {
						return "Product IDs start with 1";
					}
					if (!/^[0-9]+$/.test(data.toString())) {
						return "Id must be greater then zero";
					}
				},
				setValueAs: (v) => {
					if (typeof v === "string" && v.length !== 0) {
						return parseInt(v, 10);
					}

					return null;
				},
			})}
			type='number'
			placeholder='Searching for product with id...'
			helperText={errors.id?.message}
			error={!!errors.id}
		/>
	);
};
