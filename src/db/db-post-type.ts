import {SortDirectionsType} from "./db-types";
import {ObjectId} from "mongodb";

export type PostSchemaType = {
    _id: ObjectId;
    title: string
    shortDescription: string, //maxLength: 100
    content: string, //maxLength: 1000
    blogId: string,
    blogName: string,
    createdAt: string,
}

export type PostSchemaInputType = {
    title: string
    shortDescription: string, //maxLength: 100
    content: string, //maxLength: 1000
    blogId: string,
    blogName: string
}

export type PostSortByTypes = 'title' | 'shortDescription' | 'createdAt' | 'content' | 'blogId' | 'blogName';
export type PostQueryInputType = {
    sortBy: PostSortByTypes,
    sortDirection: SortDirectionsType,
    pageNumber: number,
    pageSize: number,

}