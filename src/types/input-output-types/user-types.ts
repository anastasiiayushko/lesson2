import {SortDirectionsType} from "../../db/types/db-types";

export type UserSecureViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: string,
}
export type UserInputModel = {
    login: string, // maxLength: 10 minLength: 3  pattern: ^[a-zA-Z0-9_-]*$ must be unique
    email: string, // 	 pattern: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$ example: example@example.com must be unique
    password: string, // maxLength: 20 minLength: 6
}
export type UserFullViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: string,
    password: string,
}


export type UserQueryInputType = {
    searchEmailTerm: string | null,
    searchLoginTerm: string | null,
    sortBy: 'login' | 'email' | 'createdAt',
    sortDirection: SortDirectionsType,
    pageNumber: number,
    pageSize: number,
}

export type UserAuthMeModelViewType = { email: string, login: string, userId: string };
