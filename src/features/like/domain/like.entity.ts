import {HydratedDocument, model, Model, Schema} from "mongoose";
import {ObjectId} from "mongodb";

export enum LikeStatusEnum {
    Like = "Like",
    Dislike = "Dislike",
    None = "None"
}

export interface ILike {
    status: LikeStatusEnum;
    createdAt: Date,
    authorId: Schema.Types.ObjectId;
    authorName: Schema.Types.String;
    parentId: Schema.Types.ObjectId; // commentId, postId, etc..
}

export type LikeDocument = HydratedDocument<ILike>;

type CreateLikeInput = {
    status: LikeStatusEnum;
    authorId: string;
    authorName: string;
    parentId: string;
}


interface ILikeModel extends Model<ILike> {
    createLike: (dto: CreateLikeInput) => Promise<LikeDocument>
}

const likeSchema = new Schema<ILike>({
    status: {
        type: String,
        enum: Object.values(LikeStatusEnum),
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },

    parentId: {type: Schema.Types.ObjectId, required: true},
    authorId: {type: Schema.Types.ObjectId, required: true},
    authorName: {type: Schema.Types.String, required: true},
}, {versionKey: false});


likeSchema.static('createLike',  function createLike(dto: CreateLikeInput) {

    return new LikeModel({
        _id: new ObjectId(),
        status: dto.status,
        authorId: new ObjectId(dto.authorId),
        authorName: dto.authorName,
        parentId: new ObjectId(dto.parentId),
        createdAt: new Date(),
    });
});


export const LikeModel = model<ILike, ILikeModel>('likes', likeSchema);
