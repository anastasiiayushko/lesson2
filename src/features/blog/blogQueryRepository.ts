import {blogCollection} from "../../db/db";
import {PaginationViewModelType} from "../../db/db-types";
import {BlogQueryInputType, BlogSchemaType} from "../../db/db-blog-type";

export class BlogQueryRepository {

    getBlogsQuery = async (query: BlogQueryInputType)
        : Promise<PaginationViewModelType<BlogSchemaType>> => {
        let filter = {};
        if (query.searchNameTerm) {
            filter = {name: {$regex: query.searchNameTerm, $options: "i"}};
        }
        let sortBy = query.sortBy as string;
        let sortingDirection = query.sortDirection;
        let limit = +query.pageSize;
        let page = +query.pageNumber;
        let skip: number = (page - 1) * limit;

        let items = await blogCollection.find(filter, {
            projection: {
                _id: 0,
                // id: 1,
                // name: 1,
                // description: 1,
                // websiteUrl: 1,
                // createdAt: 1
            }
        })
            .sort({[sortBy]: sortingDirection})
            .skip(skip)
            .limit(limit)
            .toArray();

        // Подсчёт общего количества документов
        let totalCount = await blogCollection.countDocuments(filter);
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

