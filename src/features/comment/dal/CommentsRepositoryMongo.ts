import {CommentsRepository, CreateCommentType} from "./CommentsRepository";
import {CommentViewModelType} from "../core/type/input-outup-commets";
import {commentCollection} from "../../../db/db";
import {ObjectId} from "mongodb";
import {mappedCommentDbToView} from "./mapper/mappedCommentDbToView";
import {CommentSchemaType} from "../../../db/types/db-comments-type";
import {injectable} from "inversify";

@injectable()
export class CommentsRepositoryMongo implements CommentsRepository {
    async createComment  (dto: CreateCommentType): Promise<string> {
        let created = await commentCollection.insertOne(dto as CommentSchemaType);
        return created.insertedId.toString()
    }

    async updateComment  ( commentId: string, comment: string ): Promise<boolean> {
      let updated = await commentCollection.updateOne({_id: new ObjectId(commentId)}, {
          $set: {content: comment}
      })
        return updated.matchedCount === 1
    };

    async deleteComment  (commentId: string): Promise<boolean> {
        // Логика для удаления комментария
        let deleted = await commentCollection.deleteOne({_id: new ObjectId(commentId)});
        return deleted.deletedCount === 1;
    };

    async getComment  (commentId: string): Promise<CommentViewModelType | null> {
        let findComment = await commentCollection.findOne({_id: new ObjectId(commentId)});
        if (!findComment) {
            return null
        }
        return mappedCommentDbToView(findComment);
    }
}

