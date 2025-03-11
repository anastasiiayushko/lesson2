
import {CommentViewModelType} from "../core/type/input-outup-commets";
import {ICommentCreateInput} from "../domain/comment-entity";

// export type CreateCommentType = {
//     postId: string,
//     commentatorInfo: {
//         userId: string,
//         userLogin: string,
//     }
//     content: string,
//     createdAt: string,
//     likesInfo: {
//         likesCount: number,
//         dislikesCount: number,
//     }
// }



export interface CommentsRepository {

    createComment(dto: ICommentCreateInput): Promise<string>;

    updateComment(commentId: string, content: string ): Promise<boolean>;

    deleteComment(commentId: string): Promise<boolean>;

    getComment(commentId: string): Promise<CommentViewModelType | null>;
}
