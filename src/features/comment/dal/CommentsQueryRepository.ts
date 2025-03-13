import {CommentViewModelType} from "../core/type/input-outup-commets";
import {PaginationViewModelType} from "../../../types/input-output-types/pagination-output-types";
import {CommentQueryInputType} from "../helpers/commentQueryPagingDef";

export interface CommentsQueryRepository {
    getCommentById(id: string, userId: string | null): Promise<CommentViewModelType | null>;

    getCommentsByPostWithPaging(postId: string, query:CommentQueryInputType,  userId: string | null): Promise<PaginationViewModelType<CommentViewModelType>>
}
