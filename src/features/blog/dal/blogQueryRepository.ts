import {BlogQueryInputType} from "../../../db/types/db-blog-type";
import {BlogViewModelType} from "../../../types/input-output-types/blog-types";
import {WithId} from "mongodb";
import {PaginationViewModelType} from "../../../types/input-output-types/pagination-output-types";
import {injectable} from "inversify";
import {BlogModel, IBlog} from "../domain/blog.entity";


@injectable()
export class BlogQueryRepository {

    static mapperBlog(item: WithId<IBlog>): BlogViewModelType {
        return {
            id: item._id.toString(),
            name: item.name,
            description: item.description,
            websiteUrl: item.websiteUrl,
            isMembership: item.isMembership,
            createdAt: new Date(item.createdAt).toISOString(),
        }
    }

    async getById(id: string): Promise<BlogViewModelType | null> {

        const blog = await BlogModel.findOne({_id: id}).lean();

        return blog ? BlogQueryRepository.mapperBlog(blog) : null

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

        let items = await BlogModel.find(filter)
            .sort({[sortBy]: sortingDirection})
            .skip(skip)
            .limit(limit)
            .lean();

        // Подсчёт общего количества документов
        let totalCount = await BlogModel.countDocuments(filter);
        let pagesCount = Math.ceil(totalCount / limit);

        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: limit,
            totalCount: totalCount,
            items: items.map(BlogQueryRepository.mapperBlog)
        }

    }


}

