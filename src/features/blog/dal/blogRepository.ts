import {BlogSchemaInputType} from "../../../db/types/db-blog-type";
import {BlogViewModelType} from "../../../types/input-output-types/blog-types";
import {WithId} from "mongodb";
import {injectable} from "inversify";
import {BlogDocument, BlogModel, IBlog} from "../domain/blog.entity";

@injectable()
export class BlogRepository {

    static mapDbBlogToView(item: WithId<IBlog>): BlogViewModelType {
        return {
            id: item._id.toString(),
            name: item.name,
            websiteUrl: item.websiteUrl,
            description: item.description,
            createdAt: item.createdAt.toISOString(),
            isMembership: item.isMembership
        }
    }


    getById = async (id: string): Promise<BlogViewModelType | null> => {
        const blog = await BlogModel.findOne({_id: id}).lean();
        if(!blog) {
            return null;
        }
        return BlogRepository.mapDbBlogToView(blog)

    }



    async updateById(id: string, dto: BlogSchemaInputType): Promise<boolean> {
        const blog = await BlogModel.findByIdAndUpdate({_id: id}, {...dto}, {runValidators: true}).lean();
        return !!blog;
    }

    async deleteDyId(id: string): Promise<boolean> {
        const blog = await BlogModel.findOneAndDelete({_id:id}).lean();
        return !!blog;

    }

    async save(blog: BlogDocument): Promise<void> {
         await blog.save()
    }
}

