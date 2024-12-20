import {config} from 'dotenv'

config() // добавление переменных из файла .env в process.env
enum SettingsPath {
    blogs = "/blogs",
    posts = "/posts",
    testing = "/testing",
}

enum SettingsDBCollection {
    blogs = "blogs",
    posts = "posts",
}




export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    PATH: {
        BLOGS: SettingsPath.blogs,
        POSTS: SettingsPath.posts,
        TESTING: SettingsPath.testing,
    },
    DB_COLLECTION_NAME: {
        BLOGS: SettingsDBCollection.blogs,
        POSTS: SettingsDBCollection.posts,
    },
    ADMIN: process.env.ADMIN || 'admin:qwerty',
    MONGO_URL: process.env.MONGO_URL ||"mongodb://localhost:27017" ,
    DATABASE_NAME: process.env.DATABASE_NAME ,
}
