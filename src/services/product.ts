import { useQuery } from "@tanstack/react-query";
import { HttpError } from "../utils/HttpError";
import { newURLFromParams } from "../utils/newUrlFromParams";
import {
	API_BASE,
	ApiItemResponse,
	ApiPaginationResponse,
	GetProductQueryParams,
	GetProductsQueryParams,
	Product,
} from "./apiDataTypes";

const getProducts = async (searchParam?: GetProductsQueryParams) => {
	const url = newURLFromParams(`${API_BASE}/products`, searchParam);
	const res = await fetch(url);

	if (!res.ok) {
		throw new HttpError(await res.text(), res.status);
	}

	return (await res.json()) as ApiPaginationResponse<Product>;
};

const getProductById = async (searchParam: GetProductQueryParams) => {
	const url = newURLFromParams(`${API_BASE}/products`, searchParam);
	const res = await fetch(url);

	if (!res.ok) {
		throw new HttpError(await res.text(), res.status);
	}

	return (await res.json()) as ApiItemResponse<Product>;
};

export const useProduct = (id: number) => {
	return useQuery<ApiItemResponse<Product>, HttpError>({
		queryKey: ["product", id],
		queryFn: () => getProductById({ id }),
		staleTime: Infinity,
		keepPreviousData: true,
		retry: false,
	});
};

export const useProducts = (opts: Required<GetProductsQueryParams>) => {
	return useQuery<ApiPaginationResponse<Product>, HttpError>({
		queryKey: ["products", opts.page, opts.per_page],
		queryFn: () => getProducts(opts),
		keepPreviousData: true,
		staleTime: Infinity,
	});
};
