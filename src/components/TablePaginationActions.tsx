import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";

interface TablePaginationActionsProps {
	count: number;
	page: number;
	rowsPerPage: number;
	onPageChange: (
		event: React.MouseEvent<HTMLButtonElement>,
		newPage: number
	) => void;
}

export function TablePaginationActions(props: TablePaginationActionsProps) {
	const { count, page, rowsPerPage, onPageChange } = props;

	return (
		<Box sx={{ flexShrink: 0, ml: 2.5 }}>
			<IconButton
				onClick={(event) => onPageChange(event, page - 1)}
				disabled={page === 0}
				aria-label='previous page'
			>
				<KeyboardArrowLeft />
			</IconButton>
			<IconButton
				onClick={(event) => onPageChange(event, page + 1)}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label='next page'
			>
				<KeyboardArrowRight />
			</IconButton>
		</Box>
	);
}
