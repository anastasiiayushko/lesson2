export type PaginationViewModelType<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T[]
}

export  type   SortDirectionsType = "asc" | "desc";


