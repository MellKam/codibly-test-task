import { useQuery } from "@tanstack/react-query";
import { HttpError } from "../utils/HttpError";
import { parseObjectToQueryString } from "../utils/parseObjectToQueryString";
import {
  API_BASE,
  ApiItemResponse,
  ApiPaginationResponse,
  GetProductQueryParams,
  GetProductsQueryParams,
  Product,
} from "./apiDataTypes";

const getProducts = async (queryParams?: GetProductsQueryParams) => {
  const res = await fetch(
    `${API_BASE}/products${
      queryParams === undefined ? "" : parseObjectToQueryString(queryParams)
    }`,
  );

  if (!res.ok) {
    throw new HttpError(await res.text(), res.status);
  }

  return (await res.json()) as ApiPaginationResponse<Product>;
};

const getProductById = async (queryParams: GetProductQueryParams) => {
  const res = await fetch(
    `${API_BASE}/products${parseObjectToQueryString(queryParams)}`,
  );

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

export const useProducts = (
  opts: Required<GetProductsQueryParams>,
) => {
  return useQuery<ApiPaginationResponse<Product>, HttpError>({
    queryKey: ["products", opts.page],
    queryFn: () => getProducts(opts),
    keepPreviousData: true,
    staleTime: Infinity,
  });
};
