import { Box, TextField } from "@mui/material";
import { useState } from "react";
import { FilteredProductTable, ProductsTable } from "./components/ProductTable";

export const App = () => {
	const [filterId, setFilterId] = useState<number | null>(null);
	const itemsPerPage = 5;

	return (
		<Box maxWidth='800px' display='flex' mx='auto' flexDirection='column'>
			<TextField
				id='filter-id'
				inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
				type='number'
				onChange={(e) =>
					setFilterId(e.target.value === "" ? null : +e.target.value)
				}
			/>
			<Box mt='8px'>
				{filterId === null ? (
					<ProductsTable itemsPerPage={itemsPerPage} />
				) : (
					<FilteredProductTable productId={filterId} />
				)}
			</Box>
		</Box>
	);
};
