import {postCollection} from "../../../db/db";
import {PostQueryInputType, PostSchemaType} from "../../../db/types/db-post-type";
import {PostViewModel} from "../../../types/input-output-types/post-types";
import {ObjectId} from "mongodb";
import {PaginationViewModelType} from "../../../types/input-output-types/pagination-output-types";
import {injectable} from "inversify";


@injectable()
export class PostQueryRepository {
    _mapDbPostToView(item: PostSchemaType): PostViewModel {
        return {
            id: item._id.toString(),
            title: item.title,
            content: item.content,
            shortDescription: item.shortDescription,
            blogName: item.blogName,
            blogId: item.blogId.toString(),
            createdAt: item.createdAt
        }
    }

    async getById(id: string): Promise<PostViewModel | null> {
        let post = await postCollection.findOne({_id: new ObjectId(id)});
        if (!post) {
            return null
        }
        return this._mapDbPostToView(post);
    }

    async getPostQuery(query: PostQueryInputType, blogId?: string | undefined)
        : Promise<PaginationViewModelType<PostViewModel>> {
        let sortBy = query.sortBy as string;
        let sortingDirection = query.sortDirection;
        let limit = +query.pageSize;
        let page = +query.pageNumber;
        let skip: number = (page - 1) * limit;
        let findFilter = blogId ? {blogId: blogId} : {};

        let items = await postCollection.find(findFilter)
            .sort({[sortBy]: sortingDirection})
            .skip(skip)
            .limit(limit)
            .toArray();

        // Подсчёт общего количества документов
        let totalCount = await postCollection.countDocuments(findFilter);
        let pagesCount = Math.ceil(totalCount / limit);

        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: limit,
            totalCount: totalCount,
            items: items.map(this._mapDbPostToView)
        }

    }


}

