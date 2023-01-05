import { useQuery, UseQueryResult } from "@tanstack/react-query";

const API_BASE = "https://reqres.in/api";

export interface Product {
  id: number;
  name: string;
  year: number;
  /**
   * HEX color
   * @example "#98B2D1"
   */
  color: string;
  pantone_value: string;
}

export interface GetProductsQueryParams {
  /**
   * @default 6
   */
  per_page?: number;
  /**
   * @default 1
   */
  page?: number;
}

// const delay = async <T>(handler: () => T, delay: number) => {
//   return new Promise<T>(async (resolve, reject) => {
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

  const res = await fetch(`${API_BASE}/products${queryParams}`);

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return (await res.json()) as ApiPaginationResponse<Product>;
};

export const getProductById = async (id: number) => {
  const res = await fetch(`${API_BASE}/products?id=${id}`);

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return (await res.json()) as ApiItemResponse<Product>;
};

export const useProduct = (id: number) => {
  return useQuery({
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
  // we must to increment page count because
  // our api pages start with 1
  // and the MUI pagination starts with 0
  opts.page += 1;

  return useQuery({
    queryKey: ["products", opts.page],
    queryFn: () => getProducts(opts),
    keepPreviousData: true,
    staleTime: Infinity,
  });
};

export interface ApiPaginationResponse<Item> {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: Item[];
  support: {
    url: string;
    text: string;
  };
}

export interface ApiItemResponse<Item> {
  data: Item;
  support: {
    url: string;
    text: string;
  };
}
