import {CommentsRepository} from "./CommentsRepository";
import {commentCollection} from "../../../db/db";
import {ObjectId, WithId} from "mongodb";
import {injectable} from "inversify";
import {CommentDocument, commentModel, IComment, ICommentCreateInput} from "../domain/comment-entity";

@injectable()
export class CommentsRepositoryMongo implements CommentsRepository {
    async createComment(dto: ICommentCreateInput): Promise<string> {
        const comment = await commentModel.createComment(dto)
        return comment._id.toString();
    }

    async updateComment(commentId: string, comment: string): Promise<boolean> {
        let updated = await commentModel.updateOne({_id: new ObjectId(commentId)}, {
            content: comment
        })
        return updated.matchedCount === 1
    };

    async deleteComment(commentId: string): Promise<boolean> {
        // Логика для удаления комментария
        let deleted = await commentCollection.deleteOne({_id: new ObjectId(commentId)});
        return deleted.deletedCount === 1;
    };

    async getComment(commentId: string): Promise<WithId<IComment> | null> {
        return await commentModel.findOne({_id: commentId}).lean();
        // let findComment = await commentCollection.findOne({_id: new ObjectId(commentId)});
    }
    async save(comment:CommentDocument): Promise<CommentDocument> {
        return  comment.save();
    }
}

