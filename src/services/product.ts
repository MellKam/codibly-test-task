import { useQuery } from "@tanstack/react-query";
import { HttpError } from "./HttpError";
import {
  API_BASE,
  ApiItemResponse,
  ApiPaginationResponse,
  GetProductsQueryParams,
  Product,
} from "./api";

// const delay = async <T>(handler: () => T, delay: number) => {
//   return new Promise<T>(async (resolve, _) => {
//     setTimeout(async () => {
//       resolve(await handler());
//     }, delay);
//   });
// };

export const getProducts = async (opts?: GetProductsQueryParams) => {
  const queryParams = opts != undefined
    ? "?" + (Object.keys(opts) as (keyof typeof opts)[])
      .map((key) => `${key}=${opts[key]}`)
      .join("&")
    : "";

  // const res = await delay(
  //   () => fetch(`${API_BASE}/products${queryParams}`),
  //   2000,
  // );

  const res = await fetch(`${API_BASE}/products${queryParams}`);

  if (!res.ok) {
    throw new HttpError(await res.text(), res.status);
  }

  return (await res.json()) as ApiPaginationResponse<Product>;
};

export const getProductById = async (id: number) => {
  const res = await fetch(`${API_BASE}/products?id=${id}`);

  if (!res.ok) {
    throw new HttpError(await res.text(), res.status);
  }

  return (await res.json()) as ApiItemResponse<Product>;
};

export const useProduct = (id: number) => {
  return useQuery<ApiItemResponse<Product>, HttpError>({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
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
