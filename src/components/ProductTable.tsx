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
import {
	FC,
	ReactNode,
	memo,
	useState,
	useCallback,
	useMemo,
} from "react";
import { Product } from "../services/apiDataTypes";
import { TablePaginationActions } from "./TablePaginationActions";
import { ProductModal } from "./ProductModal";
import { useProducts, useProduct } from "../services/product";
import {
	DEFAULT_PAGE,
	DEFAULT_ITEMS_PER_PAGE,
	ITEMS_PER_PAGE_OPTIONS,
} from "../constants";
import { useProductSearchFormContext } from "../contexts/ProductSearchFormContext";
import { useIntSearchParam } from "../hooks/useIntSearchParam";

const ProductTableRow: FC<{ product: Product }> = ({ product }) => {
	const [isModalOpen, setModalState] = useState(false);

	const handleModalClose = useCallback(() => {
		setModalState(false);
	}, [setModalState]);

	const handleModalOpen = useCallback(() => {
		setModalState(true);
	}, [setModalState]);

	return (
		<>
			<TableRow
				sx={{ backgroundColor: product.color, cursor: "pointer" }}
				onClick={handleModalOpen}
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
				handleClose={handleModalClose}
			/>
		</>
	);
};

interface TablePaginationProps {
	currentPage: number;
	itemsPerPage: number;
	totalItems: number;
	handlerPageChange: (nextPage: number) => void;
	handleChangeRowsPerPage: (nextValue: number) => void;
}

const ProductsTableWrapper: FC<{
	pagination?: TablePaginationProps;
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
								rowsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
								colSpan={3}
								count={pagination.totalItems}
								rowsPerPage={pagination.itemsPerPage}
								page={pagination.currentPage}
								onPageChange={(_, newPage) =>
									pagination.handlerPageChange(newPage)
								}
								onRowsPerPageChange={(e) => {
									pagination.handleChangeRowsPerPage(parseInt(e.target.value));
								}}
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
	const [page, setPage] = useIntSearchParam("page", DEFAULT_PAGE);
	const [itemsPerPage, setItemsPerPage] = useIntSearchParam(
		"items_per_page",
		DEFAULT_ITEMS_PER_PAGE
	);

	const {
		data: products,
		status,
		error,
		isFetching,
	} = useProducts({
		page,
		per_page: itemsPerPage,
	});

	if (products && products.total_pages < page) {
		setPage(DEFAULT_PAGE);
		return null;
	}

	if (products && products.total < itemsPerPage) {
		setItemsPerPage(DEFAULT_ITEMS_PER_PAGE);
		return null;
	}

	const pagination = useMemo<TablePaginationProps | undefined>(() => {
		if (status === "success") {
			return {
				// we need to decrement our page because in mui
				// page starts with 0, but in our api it starts with 1
				currentPage: page - 1,
				handlerPageChange: (nextPage) => setPage(nextPage + 1),
				itemsPerPage,
				totalItems: products.total,
				handleChangeRowsPerPage: (nextValue) => {
					setItemsPerPage(nextValue);
					setPage(DEFAULT_PAGE);
				},
			};
		}
	}, [page, itemsPerPage, status]);

	return (
		<ProductsTableWrapper pagination={pagination}>
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
