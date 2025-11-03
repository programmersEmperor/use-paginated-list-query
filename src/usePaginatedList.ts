import { useEffect, useReducer } from "react";
import type { FetchMethod } from "./type";
import debounce from "debounce-promise";

const DEFAULT_PAGE_SIZE = 10;

interface State <T, F>{
	filters: F;
	data: T[];
	page: number;
	next: string | null;
	previous: string | null;
	totalCount: number;
	isLoading: boolean;
	error: unknown;
}

const initialState: State<unknown, unknown> = {
	filters: {
		searchValue: "",
	},
	data: [],
	page: 1,
	next: null,
	previous: null,
	totalCount: 0,
	isLoading: false,
	error: null,
};

type StartFetchingAction = {
	type: "start-fetching";
};
type ReplaceDataAction<T> = {
	type: "replace-data";
	data: T[];
	totalCount: number;
	next: string | null;
	previous: string | null;
};
type ChangePageAction = {
	type: "change-page";
	page: number;
};
type FetchErrorAction = {
	type: "fetch-error";
	error: unknown;
};
type ChangeFiltersAction<T, F> = {
	type: "change-filters";
	filters: State<T, F>["filters"];
};
type ResetFiltersAction = {
	type: "reset-filters";
};


type Action<T, F> =
	| StartFetchingAction
	| ReplaceDataAction<T>
	| ChangePageAction
	| FetchErrorAction
	| ChangeFiltersAction<T, F>
	| ResetFiltersAction;

function reducer<T, F>(state: State<T, F>, action: Action<T, F>): State<T, F> {
	switch (action.type) {
		case "start-fetching":
			return {
				...state,
				isLoading: true,
				error: null,
			};
		case "replace-data":
			return {
				...state,
				isLoading: false,
				data: action.data,
				totalCount: action.totalCount,
				next: action.next,
				previous: action.previous,
			};
		case "change-page":
			return {
				...state,
				page: action.page,
			};
		case "change-filters":
			return {
				...state,
				filters: {
                    ...state.filters,
                    ...action.filters,
                },
			};
		case "fetch-error":
			return {
				...state,
				isLoading: false,
				error: action.error,
			};
		case "reset-filters": 
			return {
				...state, 
				filters: {} as F,
			};
		default:
			return state;
	}
}




type Props<T extends FetchMethod> =  T extends (args: infer F) => any 
	? F extends {pathParams: infer V} 
		? {
			fetchMethod: T, 
			pathParams: V, 
			pageSize?: number, 
			debounceTime?: number
			initialState?: Partial<State<FetchMethodResult<T>, FetchMethodFilter<T>>>;
			disabled?: boolean;
		}
		: {
			fetchMethod: T, 
			pageSize?: number, 
			debounceTime?: number
			initialState?: Partial<State<FetchMethodResult<T>, FetchMethodFilter<T>>>;
			disabled?: boolean;
		}
	: {
		fetchMethod: T, 
		pageSize?: number, 
		debounceTime?: number
		initialState?: Partial<State<FetchMethodResult<T>, FetchMethodFilter<T>>>;
		disabled?: boolean;
	}

type FetchMethodResult<T extends FetchMethod> = T extends (args: any) => Promise<{ results: (infer F)[] } >? F: never;
type FetchMethodFilter<T extends FetchMethod> = T extends (args: infer F) => any ? F extends {filters: infer V} ? V : never: never; 


let controller: AbortController | null = null;
function usePaginatedList<T extends FetchMethod>(args: Props<T>) : PaginatedListResult<FetchMethodResult<T>, FetchMethodFilter<T>> {
	const [state, dispatch] = useReducer(reducer<FetchMethodResult<T>, FetchMethodFilter<T>>, {
		...initialState,
		...(args.initialState ?? {}),
	} as State<FetchMethodResult<T>, FetchMethodFilter<T>>);
	const debouncedFetchMethod = debounce(args.fetchMethod, args.debounceTime ?? 500);

	useEffect(() => {
		fetchData();

		return () => {
			controller?.abort();
		};
	}, [state.page, state.filters, args.disabled]);


	
	async function fetchData() {
		if (args.disabled) {
			return;
		}
		
		controller = new AbortController();
		const abortSignal = controller?.signal;

		try {
			dispatch({ type: "start-fetching" });
			const { results, count, next, previous } = await debouncedFetchMethod({
				page: state.page,
				page_size: args.pageSize ?? DEFAULT_PAGE_SIZE,
				filters: state.filters,
				signal: abortSignal,
				...("pathParams" in args ? {pathParams:args.pathParams} : {})
			});
			dispatch({
				type: "replace-data",
				data: results,
				totalCount: count,
				next,
				previous,
			});
		} catch (error) {
			if (abortSignal.aborted) {
				return;
			}
			dispatch({ type: "fetch-error", error });
		}
	}


	const changePage = (page: number) => {
		dispatch({ type: "change-page", page });
	};

	const changeFilters = (filters: State<FetchMethodResult<T>, FetchMethodFilter<T>>["filters"]) => {
		dispatch({ type: "change-filters", filters });
	};

	const resetFilters= ()=>{
		dispatch({type: 'reset-filters'})
	}

	const abort = () => {
		controller?.abort();
	};

	return {
		filters: state.filters,
		onFiltersChange: changeFilters,
		data: state.data,
		page: state.page,
		totalCount: state.totalCount,
		isLoading: state.isLoading,
		changePage,
		error: state.error,
		pageSize: args.pageSize ?? DEFAULT_PAGE_SIZE,
		refetchData: fetchData,
		resetFilters,
		abort,
	};
};

export default usePaginatedList;

type PaginatedListResult<T, F> = {
    filters: F;
    onFiltersChange: (filters: State<T, F>["filters"]) => void;
    data: T[];
    page: number;
    totalCount: number;
    isLoading: boolean;
    changePage: (page: number) => void;
    error: unknown;
    pageSize: number;
    refetchData: () => Promise<void>;
    resetFilters: () => void;
    abort: () => void;
}
