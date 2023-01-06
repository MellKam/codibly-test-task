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
import { FC, ReactNode, useEffect, useState, memo } from "react";
import { Product } from "../services/api";
import { TablePaginationActions } from "./TablePaginationActions";
import { ProductModal } from "./ProductModal";
import { useSearchParams } from "../hooks/useSearchParams";
import { useProducts, useProduct } from "../services/product";
import { DEFAULT_PAGE, ITEMS_PER_PAGE } from "../constants";

export const ProductTableCell: FC<{ product: Product }> = ({ product }) => {
	const [isModalOpen, setModalState] = useState(false);

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
}> = ({ children, pagination }) => {
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

export const ProductsTable = () => {
	const [page, setPage] = useState(DEFAULT_PAGE);

	const {
		data: products,
		status,
		error,
	} = useProducts({
		page,
		per_page: ITEMS_PER_PAGE,
	});

	const { searchParams, setSearchParams } = useSearchParams();

	useEffect(() => {
		const searchPage = searchParams.get("page");
		if (searchPage) {
			const numPage = parseInt(searchPage);
			if (!isNaN(numPage) && page !== numPage) setPage(numPage);
		}
	}, [searchParams]);

	useEffect(() => {
		setSearchParams((prev) => {
			if (prev.get("page") === null && page === DEFAULT_PAGE) {
				return prev;
			}

			prev.set("page", page.toString());
			return prev;
		});
	}, [page]);

	return (
		<ProductsTableWrapper
			pagination={
				status === "success"
					? {
							// we need to decrement our page because in mui
							// page starts with 0, but in our api it starts with 1
							currentPage: page - 1,
							// and increment when set it
							handlerPageChange: (nextPage) => setPage(nextPage + 1),
							itemsPerPage: ITEMS_PER_PAGE,
							totalItems: products.total,
					  }
					: undefined
			}
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

export const FilteredProductTable: FC<{ productId: number }> = memo(
	({ productId }) => {
		const { status, data: product, error } = useProduct(productId);

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
							{error.status === 404
								? `Cannot find product with id ${productId}`
								: error.message}
						</TableCell>
					</TableRow>
				) : (
					<ProductTableCell product={product.data} />
				)}
			</ProductsTableWrapper>
		);
	}
);
