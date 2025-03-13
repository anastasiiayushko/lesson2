import {CommentDocument, IComment, ICommentCreateInput} from "../domain/comment-entity";
import {WithId} from "mongodb";


export interface CommentsRepository {

    createComment(dto: ICommentCreateInput): Promise<string>;

    updateComment(commentId: string, content: string): Promise<boolean>;

    deleteComment(commentId: string): Promise<boolean>;

    getComment(commentId: string): Promise<WithId<IComment> | null>;

    save(comment: CommentDocument): Promise<CommentDocument>;
}
