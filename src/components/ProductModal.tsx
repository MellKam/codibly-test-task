import { Modal, Box, Typography } from "@mui/material";
import { FC } from "react";
import { Product } from "../services/apiDataTypes";

export const ProductModal: FC<{
	product: Product;
	isOpen: boolean;
	handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void;
}> = ({ product, handleClose, isOpen }) => {
	return (
		<Modal open={isOpen} onClose={handleClose}>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					maxWidth: "400px",
					width: "100%",
				}}
			>
				<Box
					sx={{
						padding: "20px",
						margin: "16px",
						backgroundColor: "white",
						borderRadius: "6px",
					}}
				>
					<Box
						sx={{
							width: "100%",
							height: "40px",
							backgroundColor: product.color,
							borderRadius: "4px",
						}}
					></Box>
					<Typography variant='h6' component='h2' fontWeight='bold' mt='8px'>
						#{product.id} {product.name}
					</Typography>

					<Box sx={{ mt: 2 }}>
						<Typography>Year: {product.year}</Typography>
						<Typography>Pentone value: {product.pantone_value}</Typography>
						<Typography>Color: {product.color}</Typography>
					</Box>
				</Box>
			</Box>
		</Modal>
	);
};
