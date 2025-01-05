import {SortDirectionsType} from "./db-types";
import {ObjectId} from "mongodb";

export type BlogSchemaType = {
    _id: ObjectId
    name: string // max 15
    description: string // max 500
    websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
    createdAt: string
    isMembership: boolean
}

export type BlogCreateSchemaType = {
    name: string // max 15
    description: string // max 500
    websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
    createdAt: string
    isMembership: boolean
}

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
