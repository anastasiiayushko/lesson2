import {SortDirectionsType} from "./db-types";
import {WithId} from "mongodb";
import {IBlog} from "../../features/blog/domain/blog.entity";


export type BlogSchemaType = WithId<IBlog>


export type BlogSchemaInputType = {
    name: string // max 15
    description: string // max 500
    websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
}


export type BlogQueryInputType = {
    searchNameTerm: string | null,
    sortBy: 'name' | 'description' | 'websiteUrl' | 'isMembership' | 'createdAt',
    sortDirection: SortDirectionsType,
    pageNumber: number,
    pageSize: number,

}
