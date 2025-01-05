import {BlogQueryInputType} from "../../../db/types/db-blog-type";

export const blogQueryPagingDef = (query: BlogQueryInputType): BlogQueryInputType => {

    return {
        pageNumber: query?.pageNumber ? +query.pageNumber : 1,
        pageSize: query?.pageSize ? +query.pageSize : 10,
        sortBy: query?.sortBy ?? 'createdAt',
        sortDirection: query?.sortDirection === 'asc' ? 'asc' : 'desc',
        searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
    }
}