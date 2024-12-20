import {PostSchemaInputType, PostSchemaType} from "../../db/db-types";


export type PostViewModel = PostSchemaType;
export type PostInputModel = Omit<PostSchemaInputType, 'blogName'>;