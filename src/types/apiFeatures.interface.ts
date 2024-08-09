export interface QueryString {
  page?: string;
  sort?: string;
  limit?: string;
  fields?: string;
  keyword?: string;
  [key: string]: any;
}

export interface PaginationResult {
  currentPage: number;
  limit: number;
  numberOfPages: number;
  next?: number;
  prev?: number;
}
