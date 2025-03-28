import {HydratedDocument, model, Model, Schema} from "mongoose";
import {BaseModel} from "../../../shared/model/BaseModel";
import {IPostDB, IPostNewestLikes} from "./post-types";
import {ObjectId} from "mongodb";
import {LikeStatusEnum} from "../../like/domain/like.entity";


export type PostDocument = HydratedDocument<IPostDB, IPostMethods>;

interface IPostMethods {
    updatePost: (postDto: any) => void;
    setLikesInfo: (likesInfoDTO: LikeInfoDTO) => void;
}


interface IPostModel extends Model<IPostDB, {}, IPostMethods> {
    makeInstance: (postDto: any) => PostDocument
}

const NewestLikeSchema = new Schema({
    addedAt: {type: Date, default: Date.now},
    userId: {type: Schema.Types.ObjectId, required: true},
    login: {type: String, required: true},
}, {_id: false});
// Схема для информации о лайках и дислайках
const ExtendedLikesInfoSchema = new Schema({
    likesCount: {type: Number, default: 0},
    dislikesCount: {type: Number, default: 0},
    myStatus: {type: String, enum: [LikeStatusEnum.Like, LikeStatusEnum.None, LikeStatusEnum.Dislike], default: 'None'},
    newestLikes: [NewestLikeSchema], // список пользователей, поставивших лайк
}, {_id: false});

const postSchema = new Schema<IPostDB, IPostModel, IPostMethods>(
    {
        title: {
            type: String,
            required: true,
            maxlength: [30, "Maximum length of title 30 symbols"],
        },
        shortDescription: {
            type: String,
            required: true,
            maxlength: [100, "Maximum length of shortDescription 30 symbols"],
        },
        content: {
            type: String,
            required: true,
            maxlength: [1000, "Maximum length of content 1000 symbols"],
        },
        blogId: {
            type: Schema.Types.ObjectId, required: true
        },
        blogName: {
            type: String, required: true
        },
        createdAt: {
            type: Date,
            default: new Date(),
        },
        extendedLikesInfo: ExtendedLikesInfoSchema
    }, {versionKey: false});


postSchema.loadClass(BaseModel);

postSchema.method("updatePost", function updatePost(postDto: any) {
    this.title = postDto.title;
    this.shortDescription = postDto.shortDescription;
    this.content = postDto.content;
    this.blogId = postDto.blogId;
    this.blogName = postDto.blogName;


})

export class LikeInfoDTO {
    constructor(public likesCount: number, public dislikesCount: number, public newestLikes: IPostNewestLikes[]) {

    }
}

postSchema.method("setLikesInfo", function setLikesInfo(likesInfoDto: LikeInfoDTO) {
    this.extendedLikesInfo.likesCount = likesInfoDto.likesCount;
    this.extendedLikesInfo.dislikesCount = likesInfoDto.dislikesCount;
    this.extendedLikesInfo.newestLikes = likesInfoDto.newestLikes;


})


postSchema.static('makeInstance', function makeInstance(postDto: any): PostDocument {

    return new PostModel({
        _id: new ObjectId(),
        title: postDto.title,
        shortDescription: postDto.shortDescription,
        content: postDto.content,
        blogId: postDto.blogId,
        blogName: postDto.blogName,
        createdAt: new Date(),
        extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: LikeStatusEnum.None,
            newestLikes: []
        }
    });
})

export const PostModel = model<IPostDB, IPostModel>("posts", postSchema);


