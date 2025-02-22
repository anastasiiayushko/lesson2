import {blogCollection} from "../../../db/db";

import {BlogQueryInputType, BlogSchemaType} from "../../../db/types/db-blog-type";
import {BlogViewModelType} from "../../../types/input-output-types/blog-types";
import {ObjectId} from "mongodb";
import {PaginationViewModelType} from "../../../types/input-output-types/pagination-output-types";
import {injectable} from "inversify";


@injectable()
export class BlogQueryRepository {

    _mapperBlog(item: BlogSchemaType): BlogViewModelType {
        return {
            id: item._id.toString(),
            name: item.name,
            description: item.description,
            websiteUrl: item.websiteUrl,
            isMembership: item.isMembership,
            createdAt: item.createdAt,
        }
    }

    async getById(id: string): Promise<BlogViewModelType | null> {
        let blog = await blogCollection.findOne({_id: new ObjectId(id)});
        if (!blog) {
            return null
        }
        return this._mapperBlog(blog)

    }

    async getBlogsQuery(query: BlogQueryInputType)
        : Promise<PaginationViewModelType<BlogViewModelType>> {
        let filter = {};
        if (query.searchNameTerm) {
            filter = {name: {$regex: query.searchNameTerm, $options: "i"}};
        }
        let sortBy = query.sortBy as string;
        let sortingDirection = query.sortDirection;
        let limit = +query.pageSize;
        let page = +query.pageNumber;
        let skip: number = (page - 1) * limit;

        let items = await blogCollection.find(filter)
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
            items: items.map(this._mapperBlog)
        }

    }


}

