import {CommentsQueryRepository} from "./CommentsQueryRepository";
import {CommentViewModelType} from "../core/type/input-outup-commets";
import {commentCollection} from "../../../db/db";
import {ObjectId} from "mongodb";
import {mappedCommentDbToView} from "./mapper/mappedCommentDbToView";
import {CommentQueryInputType} from "../helpers/commentQueryPagingDef";
import {PaginationViewModelType} from "../../../types/input-output-types/pagination-output-types";

export class CommentsQueryRepositoryMongo implements CommentsQueryRepository {
    getCommentById = async (id: string): Promise<CommentViewModelType | null> => {
        let comment = await commentCollection.findOne({_id: new ObjectId(id)});
        if (!comment) {
            return null;
        }
        return mappedCommentDbToView(comment);
    }
    getCommentsByPostWithPaging = async (postId: string, query: CommentQueryInputType) :
        Promise<PaginationViewModelType<CommentViewModelType>> => {
        let sortBy = query.sortBy as string;
        let sortingDirection = query.sortDirection;
        let limit = +query.pageSize;
        let page = +query.pageNumber;
        let skip: number = (page - 1) * limit;
        let findFilter ={postId: postId};

        let items = await commentCollection.find(findFilter)
            .sort({[sortBy]: sortingDirection})
            .skip(skip)
            .limit(limit)
            .toArray();

        // Подсчёт общего количества документов
        let totalCount = await commentCollection.countDocuments(findFilter);
        let pagesCount = Math.ceil(totalCount / limit);

        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: limit,
            totalCount: totalCount,
            items: items.map(mappedCommentDbToView)
        }

    }
}