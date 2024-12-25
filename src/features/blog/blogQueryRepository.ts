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
        let skip: number = (query.pageNumber - 1) * query.pageSize;
        let limit = query.pageSize;

        let items = await blogCollection.find(filter)
            .sort({[sortBy]: sortingDirection})
            .skip(skip)
            .limit(limit)
            .toArray();

        // Подсчёт общего количества документов
        let totalCount = await blogCollection.countDocuments(filter);
        let pagesCount = Math.ceil(totalCount / query.pageSize);

        return {
            items: items,
            pageSize: query.pageSize,
            pagesCount: pagesCount,
            totalCount: totalCount,
            page: query.pageNumber
        }

    }


}

