import { Box, TextField } from "@mui/material";
import { useEffect, ChangeEvent, useState } from "react";
import { FilteredProductTable, ProductsTable } from "./components/ProductTable";
import { useDebounce } from "./hooks/useDebounce";
import { useSearchParams } from "./hooks/useSearchParams";

export const App = () => {
	const [filterId, setFilterId] = useState<number | null>(null);
	const handleFilterIdChange = useDebounce(
		(e: ChangeEvent<HTMLInputElement>) => {
			setFilterId(!e.target.value.length ? null : +e.target.value);
		},
		200
	);

	const { searchParams, setSearchParams } = useSearchParams();

	useEffect(() => {
		const id = searchParams.get("id");
		if (id) {
			const numberId = parseInt(id);
			if (!isNaN(numberId) && numberId !== filterId) setFilterId(numberId);
		}
	}, [searchParams]);

	useEffect(() => {
		filterId === null
			? setSearchParams((prev) => {
					prev.delete("id");
					return prev;
			  })
			: setSearchParams((prev) => {
					prev.set("id", filterId.toString());
					return prev;
			  });
	}, [filterId]);

	return (
		<Box maxWidth='800px' display='flex' mx='auto' flexDirection='column'>
			<TextField
				id='filter-id'
				inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
				type='number'
				placeholder='Searching for product with id...'
				/**
				 * !BUG
				 * for example: if you go to the /?id=5
				 * input will be empty, hovewer it must be with value 5
				 *
				 * i can fix this with removing debounce on input and set
				 * ```value={filterId ? filterId.toString() : ""}```
				 *
				 * but will try to found a better way to do this
				 * (because i want to save debounce)
				 * for now it is what it is :)
				 */
				onChange={handleFilterIdChange}
			/>
			<Box mt='8px'>
				{filterId === null ? (
					<ProductsTable />
				) : (
					<FilteredProductTable productId={filterId} />
				)}
			</Box>
		</Box>
	);
};
