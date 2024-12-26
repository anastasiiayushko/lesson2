import {PostQueryInputType} from "../../../db/db-post-type";

export const postQueryPagingDef = (query: PostQueryInputType): PostQueryInputType => {

    return {
        pageNumber: query?.pageNumber ? +query.pageNumber : 1,
        pageSize: query?.pageSize ? +query.pageSize : 10,
        sortBy: query?.sortBy ?? 'createdAt',
        sortDirection: query?.sortDirection === 'asc' ? 'asc' : 'desc',
    }
}