import { TextField } from "@mui/material";
import { useCallback } from "react";
import { Validate } from "react-hook-form";
import { useProductSearchFormContext } from "../contexts/ProductSearchFormContext";
import { useDebounceForm } from "../hooks/useDebounceForm";

export const ProductSearchInput = () => {
	const { defaultValues, setFormData } = useProductSearchFormContext();

	const {
		register,
		formState: { errors },
	} = useDebounceForm({
		debounceDelay: 200,
		defaultValues,
		setFormData,
	});

	const validateOptionalInt = useCallback<Validate<number | null>>((data) => {
		if (data === null) {
			return true;
		}
		if (data === 0) {
			return "Product IDs start with 1";
		}
		if (!/^[0-9]+$/.test(data.toString())) {
			return "Id must be greater then zero";
		}
	}, [])

	const setValueAsOptionalInt = useCallback<(value: string) => number | null>((v) => {
		if (typeof v === "string" && v.length !== 0) {
			const num = parseInt(v, 10);
			return isNaN(num) ? null : num;
		}

		return null;
	}, [])

	return (
		<TextField
			{...register("id", {
				validate: validateOptionalInt,
				setValueAs: setValueAsOptionalInt,
			})}
			type='number'
			placeholder='Searching for product with id...'
			helperText={errors.id?.message}
			error={!!errors.id}
		/>
	);
};
