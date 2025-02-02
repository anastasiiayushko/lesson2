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
    tokenBlackList ="tokenBlackLists"
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
        TOKEN_BLACK_LIST: SettingsDBCollection.tokenBlackList,
    },
    ADMIN: process.env.ADMIN || 'admin:qwerty',
    MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017",
    DATABASE_NAME: process.env.DATABASE_NAME,
    AUTH_GMAIL_USER: "dinaswebstudio2020@gmail.com",
    AUTH_GMAIL_PASS: "icjscncpvkvbixrr",
    AUTH_EXPIRATION_DATE_HOURS : 0,
    AUTH_EXPIRATION_DATE_MIN : 5,
    JWT_ACCESS_TIME: '10s',
    JWT_REFRESH_TIME: '20s',
    JWT_AT_SECRET: '123456789',
    JWT_RT_SECRET: '123456789'
}
