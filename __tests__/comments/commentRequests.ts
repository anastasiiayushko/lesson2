import request, {Response} from "supertest";
import {app} from "../../src/app";
import {SETTINGS} from "../../src/settings";
import {CommentViewModelType} from "../../src/features/comment/core/type/input-outup-commets";
import {ApiErrorResultType} from "../../src/types/output-error-types";
import {CommentQueryInputType} from "../../src/features/comment/helpers/commentQueryPagingDef";
import {PaginationViewModelType} from "../../src/types/input-output-types/pagination-output-types";

const URL = SETTINGS.PATH.COMMENTS;
const URL_POSTS = SETTINGS.PATH.POSTS;

export type ResponseBodySuperTest<T = null> = Promise<Response & { body: T }>

export const commentRequests = {
    getCommentById: async (id: String): ResponseBodySuperTest<CommentViewModelType | null> => {
        let url = `${URL}/${id}`;
        return await request(app).get(url)
    },
    createCommentByPostIdParams: async (jwtToken: string, postId: string, contentBody: string): ResponseBodySuperTest<CommentViewModelType | ApiErrorResultType> => {
        let url = `${URL_POSTS}/${postId}/comments`;
        return await request(app).post(url)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({content: contentBody});
    },
    updateComment: async (jwtToken: string, commentId: string, contentBody: string): ResponseBodySuperTest<ApiErrorResultType | null> => {
        let url = `${URL}/${commentId}`;
        return await request(app).put(url)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({content: contentBody});
    },
    deleteComment: async (jwtToken: string, commentId: string): ResponseBodySuperTest<null> => {
        return await request(app).delete(`${URL}/${commentId}`)
            .set("Authorization", `Bearer ${jwtToken}`)

    },
    getCommentsByPostWithPaging: async (postId: string, query: Partial<CommentQueryInputType>): ResponseBodySuperTest<PaginationViewModelType<CommentViewModelType>> => {
        let url = `${URL_POSTS}/${postId}/comments`;
        return await request(app).get(url)
            .query(query)
    }
}