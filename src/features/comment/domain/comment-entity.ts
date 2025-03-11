import {HydratedDocument, Model, model, Schema} from "mongoose";
import {ObjectId} from "mongodb";
import {BaseModel} from "../../../shared/model/BaseModel";

export interface IComment {
    content: string;
    commentatorInfo: {
        userId: Schema.Types.ObjectId,
        userLogin: string,
    },
    createdAt: Date;
    postId: Schema.Types.ObjectId;
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
    }
}

export type CommentDocument = HydratedDocument<IComment>;

interface ICommentModel extends Model<IComment> {
    createComment(dto: ICommentCreateInput): Promise<CommentDocument>;
}

const commentSchema = new Schema<IComment, ICommentModel>({
    content: {
        type: String,
        minLength: [20, "Minimum comment content length 20 symbols"],
        maxLength: [300, "Maximum comment content length 20 symbols"],
        required: true
    },
    commentatorInfo: {
        userId: {type: Schema.Types.ObjectId, required: true,},
        userLogin: {type: Schema.Types.String, required: true},
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    postId: {type: Schema.Types.ObjectId, required: true},
    likesInfo: {
        likesCount: {type: Number, required: true, default: 0},
        dislikesCount: {type: Number, required: true, default: 0},
    }
}, {versionKey: false});


commentSchema.loadClass(BaseModel)

export interface ICommentCreateInput {
    content: string;
    userId: string;
    userLogin: string;
    postId: string;
}

commentSchema.static('createComment', function (dto: ICommentCreateInput) {
    const comment = {
        content: dto.content,
        commentatorInfo: {
            userId: new ObjectId(dto.userId),
            userLogin: dto.userLogin,
        },
        postId: new ObjectId(dto.postId),
        likesInfo: {
            likesCount: 0,
            dislikesCount: 0,
        },
        createdAt: new Date(),
    }
    return this.create(comment);
});

commentSchema.pre('deleteOne', { document: true, query: false }, function(doc) {
    console.log('Deleting doc!', doc);
});


export const commentModel = model<IComment, ICommentModel>('comments', commentSchema);