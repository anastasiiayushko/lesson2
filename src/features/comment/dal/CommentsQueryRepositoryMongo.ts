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
    //
    async getCommentById(id: string, userId: string | null): Promise<CommentViewModelType | null> {
        const comment = await commentModel.findById(id);
        if (!comment) {
            return null;
        }
        let status = LikeStatusEnum.None;
        if (userId) {
            const like = await likeModel.findOne({authorId: userId, parentId: id}).lean();
            if (like) {
                status = like.status;
            }

        }
        return mappedCommentDbToView(comment, status);
    }

    async getCommentsByPostWithPaging(postId: string, query: CommentQueryInputType, userId: string | null): Promise<any> {
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

        // Подсчёт общего количества документов
        const totalCount = await commentModel.countDocuments(findFilter);
        const pagesCount = Math.ceil(totalCount / limit);

        let userLikesMap = new Map<string, LikeStatusEnum>();
        if (userId) {
            const commentIds = items.map((comment) => comment._id.toString());

            // Найти все лайки, которые поставил пользователь для данных комментариев
            const userLikes = await likeModel
                .find({authorId: userId, parentId: {$in: commentIds}})
                .lean();

            // Создаем Map для быстрого поиска лайков по commentId
            userLikes.forEach((like) => {
                userLikesMap.set(like.parentId.toString(), like.status);
            });
        }


        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: limit,
            totalCount: totalCount,
            items: items.map((item) => {
                const likeStatus = userLikesMap.get(item._id.toString()) ?? LikeStatusEnum.None;
                return mappedCommentDbToView(item, likeStatus);
            })
        }

    }
}