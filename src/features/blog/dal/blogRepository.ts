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
        // let blog = await blogCollection.findOne({_id: new ObjectId(id)});
        // if (!blog) {
        //     return null
        // }
        // return BlogRepository.mapDbBlogToView(blog);
    }

    // async create(blogData: IBlog): Promise<string> {

        // let res = await blogCollection.insertOne(blogData as BlogSchemaType);
        // /** result operation insertOne
        //  acknowledged: true,
        //  insertedId: ObjectId('6764204f5f98221d8d97f09d')
        //  */
        // return res.insertedId!.toString();

    // }

    async updateById(id: string, dto: BlogSchemaInputType): Promise<boolean> {
        const blog = await BlogModel.findByIdAndUpdate({_id: id}, {...dto}, {runValidators: true}).lean();
        return !!blog;
        // const result = await blogCollection.updateOne({_id: new ObjectId(id)}, {$set: blogUpdate});
        // return result.matchedCount === 1;
    }

    async deleteDyId(id: string): Promise<boolean> {
        const blog = await BlogModel.findOneAndDelete({_id:id}).lean();
        return !!blog;
        // let result = await blogCollection.deleteOne({_id: new ObjectId(id)});
        /**
         * { acknowledged: true, deletedCount: 1 } */
        // return result.deletedCount === 1;

    }

    async save(blog: BlogDocument): Promise<void> {
         await blog.save()
    }
}

