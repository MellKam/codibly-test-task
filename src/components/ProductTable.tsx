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
	Box,
	CircularProgress,
	Typography,
} from "@mui/material";
import { FC, ReactNode, useEffect, useState, memo, useMemo } from "react";
import { Product } from "../services/apiDataTypes";
import { TablePaginationActions } from "./TablePaginationActions";
import { ProductModal } from "./ProductModal";
import { useProducts, useProduct } from "../services/product";
import { DEFAULT_PAGE, ITEMS_PER_PAGE } from "../constants";
import { useSearchParamsContext } from "../contexts/SearchParamsContext";
import { useProductSearchFormContext } from "../contexts/ProductSearchFormContext";

const ProductTableRow: FC<{ product: Product }> = ({ product }) => {
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

const ProductsTableWrapper: FC<{
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

const ProductListTable = () => {
	const { searchParams, setSearchParams } = useSearchParamsContext();

	const defaultPage = useMemo(() => {
		const page = searchParams.get("page");
		return page ? parseInt(page) : DEFAULT_PAGE;
	}, [searchParams]);

	const [page, setPage] = useState(defaultPage);

	const {
		data: products,
		status,
		error,
		isFetching,
	} = useProducts({
		page,
		per_page: ITEMS_PER_PAGE,
	});

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

	if (products && products.total_pages < page) {
		setSearchParams((prev) => {
			prev.delete("page");
			return prev;
		});

		setPage(DEFAULT_PAGE);

		return null;
	}

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
				<LoadingTableRow />
			) : status === "error" ? (
				<TableRow>
					<TableCell align='center' colSpan={3}>
						Error: {(error as Error).message}
					</TableCell>
				</TableRow>
			) : (
				<>
					{products.data.map((product) => (
						<ProductTableRow product={product} key={product.id} />
					))}
					{isFetching && <LoadingTableRow />}
				</>
			)}
		</ProductsTableWrapper>
	);
};

const FilteredProductTable: FC<{ productId: number }> = memo(
	({ productId }) => {
		const { status, data: product, error, isFetching } = useProduct(productId);

		return (
			<ProductsTableWrapper>
				{status === "loading" ? (
					<LoadingTableRow />
				) : status === "error" ? (
					<TableRow>
						<TableCell align='center' colSpan={3}>
							<Typography color='red'>
								{error.status === 404
									? `Cannot find product with id ${productId}`
									: error.message}
							</Typography>
						</TableCell>
					</TableRow>
				) : isFetching ? (
					<LoadingTableRow />
				) : (
					<ProductTableRow product={product.data} />
				)}
			</ProductsTableWrapper>
		);
	}
);

const LoadingTableRow = () => {
	return (
		<TableRow>
			<TableCell align='center' colSpan={3}>
				<Box
					display='flex'
					alignItems='center'
					columnGap='8px'
					justifyContent='center'
				>
					<CircularProgress size='24px' />
					Loading...
				</Box>
			</TableCell>
		</TableRow>
	);
};

export const ProductTable = () => {
	const { formData } = useProductSearchFormContext();

	return (
		<>
			{formData.id === null ? (
				<ProductListTable />
			) : (
				<FilteredProductTable productId={formData.id} />
			)}
		</>
	);
};
