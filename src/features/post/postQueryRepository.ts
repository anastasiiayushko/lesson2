import {postCollection} from "../../db/db";
import {FilterType, PaginationViewModelType} from "../../db/db-types";
import {PostQueryInputType, PostSchemaType} from "../../db/db-post-type";

type PostFilterType = FilterType<PostSchemaType>

export class PostQueryRepository {

    getPostQuery = async (query: PostQueryInputType, filter ?: PostFilterType | undefined)
        : Promise<PaginationViewModelType<PostSchemaType>> => {
        let sortBy = query.sortBy as string;
        let sortingDirection = query.sortDirection;
        let limit = +query.pageSize;
        let page = +query.pageNumber;
        let skip: number = (page - 1) * limit;
        let findFilter: FilterType<PostSchemaType> | {} = filter ?? {};

        let items = await postCollection.find(findFilter, {
            projection: {
                _id: 0,

            }
        })
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
            items: items
        }

    }


}

