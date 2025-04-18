import {config} from 'dotenv'

config() // добавление переменных из файла .env в process.env
enum SettingsPath {
    blogs = "/blogs",
    posts = "/posts",
    users = "/users",
    auth = "/auth",
    testing = "/testing",
    comments = "/comments",
    security = "/security",
}

enum SettingsDBCollection {
    blogs = "blogs",
    posts = "posts",
    users = "users",
    comments = "comments",
    tokenBlackList = "tokenBlackLists",
    securityDevices = "securityDevices",
    throttlingRate = "throttlingRates",
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
        SECURITY: SettingsPath.security,
    },
    DB_COLLECTION_NAME: {
        BLOGS: SettingsDBCollection.blogs,
        POSTS: SettingsDBCollection.posts,
        USERS: SettingsDBCollection.users,
        COMMENTS: SettingsDBCollection.comments,
        TOKEN_BLACK_LIST: SettingsDBCollection.tokenBlackList,
        DEVICE_SESSIONS: SettingsDBCollection.securityDevices,
        THROTTLING_RATE: SettingsDBCollection.throttlingRate,
    },
    ADMIN: process.env.ADMIN || 'admin:qwerty',
    MONGO_URL_WITH_DATA_NAME: process.env.MONGO_URL || "mongodb://localhost:27017",
    MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017",
    DATABASE_NAME: process.env.DATABASE_NAME || 'blog-platform',
    AUTH_GMAIL_USER: "dinaswebstudio2020@gmail.com",
    AUTH_GMAIL_PASS: "icjscncpvkvbixrr",
    AUTH_EXPIRATION_DATE_HOURS: 0,
    AUTH_EXPIRATION_DATE_MIN: 5,
    RECOVERY_PASSWORD_EXPIRATION_DATE_HOURS: 0,
    RECOVERY_PASSWORD_EXPIRATION_DATE_MIN: 5,
    JWT_ACCESS_TIME: '15m',
    JWT_REFRESH_TIME: '30m',
    JWT_AT_SECRET: process.env.JWT_AT_SECRET || '123456789',
    JWT_RT_SECRET: process.env.JWT_RT_SECRET || '123456789'
}
