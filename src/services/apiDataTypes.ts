export const API_BASE = "https://reqres.in/api";

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

export interface GetProductQueryParams {
  id: number;
}

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
