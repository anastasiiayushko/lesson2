import {CommentsQueryRepository} from "./CommentsQueryRepository";
import {CommentViewModelType} from "../core/type/input-outup-commets";
import {commentCollection} from "../../../db/db";
import {ObjectId} from "mongodb";
import {mappedCommentDbToView} from "./mapper/mappedCommentDbToView";
import {CommentQueryInputType} from "../helpers/commentQueryPagingDef";
import {PaginationViewModelType} from "../../../types/input-output-types/pagination-output-types";
import {injectable} from "inversify";
import {commentModel} from "../domain/comment-entity";
import {likeModel, LikeStatusEnum} from "../../like/domain/like.entity";

@injectable()
export class CommentsQueryRepositoryMongo implements CommentsQueryRepository {
    async getCommentById(id: string, userId: string | null): Promise<CommentViewModelType | null> {

        const comment = await commentModel.findById(id);
        // let comment = await commentCollection.findOne({_id: new ObjectId(id)});
        if (!comment) {
            return null;
        }
        let status = LikeStatusEnum.None;
        if(userId){
            const like = await likeModel.findOne({authorId:userId, parentId: id});
            if(like){
                //@ts-ignore
                status = like.status;
            }
        }
        return mappedCommentDbToView(comment, status);
    }

    async getCommentsByPostWithPaging(postId: string, query: CommentQueryInputType):
        Promise<PaginationViewModelType<CommentViewModelType>> {
        let sortBy = query.sortBy as string;
        let sortingDirection = query.sortDirection;
        let limit = +query.pageSize;
        let page = +query.pageNumber;
        let skip: number = (page - 1) * limit;
        let findFilter = {postId: new ObjectId(postId)};

        const items = await commentModel
            .find(findFilter)
            .sort({[sortBy]: sortingDirection})
            .skip(skip)
            .limit(limit)
            .lean();
        //
        // let items = await commentCollection.find(findFilter)
        //     .sort({[sortBy]: sortingDirection})
        //     .skip(skip)
        //     .limit(limit)
        //     .toArray();

        // Подсчёт общего количества документов
        let totalCount = await commentModel.countDocuments(findFilter);
        let pagesCount = Math.ceil(totalCount / limit);

        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: limit,
            totalCount: totalCount,
            items: items.map((item)=>{
                return mappedCommentDbToView(item, LikeStatusEnum.None)
            })
        }

    }
}