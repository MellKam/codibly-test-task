import { TextField } from "@mui/material";
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
