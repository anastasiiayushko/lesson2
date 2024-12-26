import {postCollection} from "../../db/db";
import {PaginationViewModelType} from "../../db/db-types";
import {PostQueryInputType, PostSchemaType} from "../../db/db-post-type";

export class PostQueryRepository {

    getPostQuery = async (query: PostQueryInputType)
        : Promise<PaginationViewModelType<PostSchemaType>> => {
        let sortBy = query.sortBy as string;
        let sortingDirection = query.sortDirection;
        let limit = +query.pageSize;
        let page = +query.pageNumber;
        let skip: number = (page - 1) * limit;

        let items = await postCollection.find({})
            .sort({[sortBy]: sortingDirection})
            .skip(skip)
            .limit(limit)
            .toArray();

        // Подсчёт общего количества документов
        let totalCount = await postCollection.countDocuments({});
        let pagesCount = Math.ceil(totalCount / limit);

        return {
            items: items,
            pageSize: limit,
            pagesCount: pagesCount,
            totalCount: totalCount,
            page: page
        }

    }


}

