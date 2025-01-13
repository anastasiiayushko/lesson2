import {config} from 'dotenv'

config() // добавление переменных из файла .env в process.env
enum SettingsPath {
    blogs = "/blogs",
    posts = "/posts",
    users = "/users",
    auth = "/auth",
    testing = "/testing",
    comments = "/comments",
}

enum SettingsDBCollection {
    blogs = "blogs",
    posts = "posts",
    users = "users",
    comments = "comments",
}


export const SETTINGS = {
    PORT: process.env.PORT || 8080,
    PATH: {
        BLOGS: SettingsPath.blogs,
        POSTS: SettingsPath.posts,
        USERS: SettingsPath.users,
        AUTH: SettingsPath.auth,
        COMMENTS: SettingsPath.comments,
        TESTING: SettingsPath.testing,
    },
    DB_COLLECTION_NAME: {
        BLOGS: SettingsDBCollection.blogs,
        POSTS: SettingsDBCollection.posts,
        USERS: SettingsDBCollection.users,
        COMMENTS: SettingsDBCollection.comments,
    },
    ADMIN: process.env.ADMIN || 'admin:qwerty',
    MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017",
    DATABASE_NAME: process.env.DATABASE_NAME,
}
