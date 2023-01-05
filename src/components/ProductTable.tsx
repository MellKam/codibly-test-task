import {
	TableContainer,
	Paper,
	Table,
	TableBody,
	TableRow,
	TableCell,
	TableFooter,
	TablePagination,
	TableHead,
} from "@mui/material";
import { FC, ReactNode, useState } from "react";
import { Product, useProducts, useProduct } from "../api";
import { TablePaginationActions } from "./TablePaginationActions";
import { ProductModal } from "./ProductModal";

export const ProductTableCell: FC<{ product: Product }> = (props) => {
	const [isModalOpen, setModalState] = useState(false);
	const { product } = props;

	return (
		<>
			<TableRow
				sx={{ backgroundColor: product.color, cursor: "pointer" }}
				onClick={() => setModalState(true)}
			>
				<TableCell component='th' style={{ width: "8%" }} scope='row'>
					{product.id}
				</TableCell>
				<TableCell style={{ width: 160, fontWeight: "bold" }}>
					{product.name}
				</TableCell>
				<TableCell style={{ width: 160 }}>{product.year}</TableCell>
			</TableRow>
			<ProductModal
				isOpen={isModalOpen}
				product={product}
				handleClose={() => setModalState(false)}
			/>
		</>
	);
};

export const ProductsTableWrapper: FC<{
	pagination?: {
		currentPage: number;
		itemsPerPage: number;
		totalItems: number;
		handlerPageChange: (nextPage: number) => void;
	};
	children: ReactNode;
}> = (props) => {
	const { children, pagination } = props;

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 500 }}>
				<TableHead>
					<TableRow>
						<TableCell>ID</TableCell>
						<TableCell>Name</TableCell>
						<TableCell>Year</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>{children}</TableBody>
				{pagination && (
					<TableFooter>
						<TableRow>
							<TablePagination
								rowsPerPageOptions={[]}
								colSpan={3}
								count={pagination.totalItems}
								rowsPerPage={pagination.itemsPerPage}
								page={pagination.currentPage}
								onPageChange={(_, newPage) =>
									pagination.handlerPageChange(newPage)
								}
								ActionsComponent={TablePaginationActions}
							/>
						</TableRow>
					</TableFooter>
				)}
			</Table>
		</TableContainer>
	);
};

export const ProductsTable: FC<{ itemsPerPage: number }> = (props) => {
	const { itemsPerPage } = props;
	const [page, setPage] = useState(0);

	const {
		data: products,
		status,
		error,
		isFetching,
	} = useProducts({
		page,
		per_page: props.itemsPerPage,
	});

	return (
		<ProductsTableWrapper
			pagination={{
				currentPage: page,
				handlerPageChange: (nextPage) => setPage(nextPage),
				itemsPerPage,
				totalItems: products?.total || 0,
			}}
		>
			{status === "loading" ? (
				<TableRow>
					<TableCell align='center' colSpan={3}>
						Loading...
					</TableCell>
				</TableRow>
			) : status === "error" ? (
				<TableRow>
					<TableCell align='center' colSpan={3}>
						Error: {(error as Error).message}
					</TableCell>
				</TableRow>
			) : (
				<>
					{products.data.map((product) => (
						<ProductTableCell product={product} key={product.id} />
					))}
				</>
			)}
		</ProductsTableWrapper>
	);
};

export const FilteredProductTable: FC<{ productId: number }> = (props) => {
	const { status, data: product, error } = useProduct(props.productId);

	return (
		<ProductsTableWrapper>
			{status === "loading" ? (
				<TableRow>
					<TableCell align='center' colSpan={3}>
						Loading...
					</TableCell>
				</TableRow>
			) : status === "error" ? (
				<TableRow>
					<TableCell align='center' colSpan={3}>
						Error: {(error as Error).message}
					</TableCell>
				</TableRow>
			) : (
				<ProductTableCell product={product.data} />
			)}
		</ProductsTableWrapper>
	);
};
