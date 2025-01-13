import {SortDirectionsType} from "../../../db/types/db-types";

export type CommentQueryInputType = {
    sortBy: 'content' | 'createdAt',
    sortDirection: SortDirectionsType,
    pageNumber: number,
    pageSize: number,

}

export const commentQueryPagingDef = (query: CommentQueryInputType): CommentQueryInputType => {
    return {
        pageNumber: query?.pageNumber ? +query.pageNumber : 1,
        pageSize: query?.pageSize ? +query.pageSize : 10,
        sortBy: query?.sortBy ?? 'createdAt',
        sortDirection: query?.sortDirection === 'asc' ? 'asc' : 'desc',
    }
}