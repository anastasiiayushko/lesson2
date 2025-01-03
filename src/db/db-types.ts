export type PaginationViewModelType<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T[]
}

export  type   SortDirectionsType = "asc" | "desc";

export type FilterType<T> = {
    [key in keyof T]?: T[key];
}




