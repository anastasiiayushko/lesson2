import * as mongoose from "mongoose";
import {HydratedDocument, Model} from "mongoose";

export interface IBlog {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: Date,
    isMembership: boolean,
}


export type BlogDocument = HydratedDocument<IBlog>;

export type DtoCreateBlogType = {
    name: string,
    description: string,
    websiteUrl: string,
    isMembership?: boolean,
    createdAt?: Date,
}

// interface IBlogStaticMethods {
//     createBlog(dto: DtoCreateBlog): string;
// }

type CreateBlogInput = {
    name: string,
    description: string,
    websiteUrl: string,
}

interface BlogModel extends Model<IBlog> {
    createBlog(dto: CreateBlogInput): Promise<HydratedDocument<IBlog>>;
}

const blogSchema = new mongoose.Schema<IBlog>({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 15,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: [500, "Description should be less or equal than 500"],
    },
    websiteUrl: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, "link should be less or equal than 100"],
        match: [
            /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
            "Invalid URL format"
        ]
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    isMembership: {
        type: Boolean, required: true
    },

}, {versionKey: false});

blogSchema.static('createBlog', function createBlog(dtoBlog: CreateBlogInput) {
    return this.create({
        name: dtoBlog.name,
        description: dtoBlog.description,
        websiteUrl: dtoBlog.websiteUrl,
        createdAt: new Date(),
        isMembership: false,
    })
})


export const BlogModel = mongoose.model<IBlog, BlogModel>('blogs', blogSchema);

