
export  type   SortDirectionsType = "asc" | "desc";

export type FilterType<T> = {
    [key in keyof T]?: T[key];
}




