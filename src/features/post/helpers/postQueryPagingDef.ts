import {PostQueryInputType} from "../../../db/types/db-post-type";

export const postQueryPagingDef = (query: PostQueryInputType): PostQueryInputType => {
    let page = query?.pageNumber ? +query.pageNumber : 1;

    return {
        pageNumber: page >= 1 ? page : 1,
        pageSize: query?.pageSize ? +query.pageSize : 10,
        sortBy: query?.sortBy ?? 'createdAt',
        sortDirection: query?.sortDirection === 'asc' ? 'asc' : 'desc',
    }
}