import {UserQueryInputType} from "../../../types/input-output-types/user-types";

export const postQueryPagingDef = (query:UserQueryInputType ):UserQueryInputType  => {

    return {
        pageNumber: query?.pageNumber ? +query.pageNumber : 1,
        pageSize: query?.pageSize ? +query.pageSize : 10,
        sortBy: query?.sortBy ?? 'createdAt',
        sortDirection: query?.sortDirection === 'asc' ? 'asc' : 'desc',
        searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
        searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null,
    }
}