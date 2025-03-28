import {injectable} from "inversify";
import {PostQueryInputType} from "../../../../db/types/db-post-type";
import {PostViewModel} from "../../../../types/input-output-types/post-types";
import {PostModel} from "../../domain/postSchema";
import {ObjectId, WithId} from "mongodb";
import {PaginationViewModelType} from "../../../../types/input-output-types/pagination-output-types";
import {IPostDB} from "../../domain/post-types";
import {LikeModel, LikeStatusEnum} from "../../../like/domain/like.entity";


@injectable()
export class PostQueryRepository {
    _mapDbPostToView(item: WithId<IPostDB>, likeStatus: keyof typeof LikeStatusEnum): PostViewModel {
        return {
            id: item._id.toString(),
            title: item.title,
            content: item.content,
            shortDescription: item.shortDescription,
            blogName: item.blogName,
            blogId: item.blogId.toString(),
            createdAt: item.createdAt.toISOString(),
            extendedLikesInfo: {
                likesCount: item.extendedLikesInfo.likesCount,
                dislikesCount: item.extendedLikesInfo.dislikesCount,
                myStatus: likeStatus,
                newestLikes: item.extendedLikesInfo.newestLikes
            },
        }
    }

    async getById(id: string, userId?: string | null): Promise<PostViewModel | null> {
        const post = await PostModel.findOne({_id: new ObjectId(id)}).lean();
        if (!post) {
            return null
        }
        const likeStatusByUser = await LikeModel.findOne({parentId: id, authorId: userId});

        return this._mapDbPostToView(post, likeStatusByUser?.status ?? LikeStatusEnum.None);
    }

    async getPostQuery(query: PostQueryInputType, blogId?: string | undefined, userId?: string | null)
        : Promise<PaginationViewModelType<PostViewModel>> {
        let sortBy = query.sortBy as string;
        let sortingDirection = query.sortDirection;
        let limit = +query.pageSize;
        let page = +query.pageNumber;
        let skip: number = (page - 1) * limit;
        let findFilter = blogId ? {blogId: blogId} : {};
        console.log('----------------query')
        console.log(query);
        console.log('----------------query')
        let items = await PostModel
            .find(findFilter)
            .sort({[sortBy]: sortingDirection})
            .skip(skip)
            .limit(limit)
            .lean();
//         return items;

        // Подсчёт общего количества документов
        let totalCount = await PostModel.countDocuments(findFilter);
        let pagesCount = Math.ceil(totalCount / limit);


        const postIds = items.map(i => i._id.toString());

        const likeStatusMap = new Map<string, keyof typeof LikeStatusEnum>();
        const likeStatusByUser = await LikeModel.find({parentId: {$in: postIds}, authorId: userId}).lean();
        likeStatusByUser.forEach((like) => {
            likeStatusMap.set(like.parentId.toString(), like.status);
        })
        const mappedPosts = items.map(item => {
            const post = this._mapDbPostToView(item, likeStatusMap.get(item._id.toString()) ?? LikeStatusEnum.None)
            return post
        });
        console.log('----------------------------')
        console.log('mappedPosts', mappedPosts);
        console.log('----------------------------')

        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: limit,
            totalCount: totalCount,
            items: mappedPosts
        }

    }


}

