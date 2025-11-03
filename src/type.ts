// Utility Interfaces for Fetch Methods Arguments

export interface PaginatedListRequest {
	page: number;
	page_size: number;
	signal?: AbortSignal;
};
export interface FilterablePaginatedListRequest<T> extends PaginatedListRequest {
	filters: T;	
};
export interface PathablePaginatedListRequest<T> extends PaginatedListRequest {
	pathParams: T;	
};
export interface FilterablePathablePaginatedListRequest<F, P> extends PaginatedListRequest {
	filters: F;
	pathParams: P;	
};

// Utility Interfaces for Fetch Methods Responses
export interface PaginatedListResponse<T> {
	results: T[];
	count: number;
	next: string | null;
	previous: string | null;
};

// Utility Types for Fetch Methods
export type FetchPaginatedListMethod<T> = (args: PaginatedListRequest) => Promise<PaginatedListResponse<T>>;
export type FetchFilterablePaginatedListMethod<T, F> = (args: FilterablePaginatedListRequest<F>) => Promise<PaginatedListResponse<T>>;
export type FetchPathablePaginatedListMethod<T, P> = (args: PathablePaginatedListRequest<P>) => Promise<PaginatedListResponse<T>>;
export type FetchFilterablePathablePaginatedListMethod<T, F, P> = (args: FilterablePathablePaginatedListRequest<F, P>) => Promise<PaginatedListResponse<T>>;

// Utility Type for general fetch methods
export type FetchMethod = FetchPaginatedListMethod<any> | FetchFilterablePaginatedListMethod<any, any> | FetchPathablePaginatedListMethod<any, any> | FetchFilterablePathablePaginatedListMethod<any, any, any>;