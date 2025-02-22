import {
    UserAuthMeModelViewType,
    UserQueryInputType,
    UserSecureViewModel
} from "../../../types/input-output-types/user-types";
import {UserSchemaType} from "../../../db/types/db-user-type";
import {userCollection} from "../../../db/db";
import {ObjectId} from "mongodb";
import {PaginationViewModelType} from "../../../types/input-output-types/pagination-output-types";
import {injectable} from "inversify";

@injectable()
export class UserQueryRepository {
    private _mapperSecureUser = (item: UserSchemaType): UserSecureViewModel => {
        return {
            id: item._id.toString(),
            login: item.login,
            email: item.email,
            createdAt: item.createdAt,
        }
    }

    private _mapperToAuthMe(item: UserSchemaType): UserAuthMeModelViewType {
        return {
            userId: item._id.toString(),
            email: item.email,
            login: item.login,
        }
    }

    async getUserForAuthMe(id: string): Promise<UserAuthMeModelViewType | null> {
        let user = await userCollection.findOne({_id: new ObjectId(id)});
        if (!user) {
            return null
        }
        return this._mapperToAuthMe(user)
    }

    async getUserById(id: string): Promise<UserSecureViewModel | null> {
        let user = await userCollection.findOne({_id: new ObjectId(id)});
        if (!user) {
            return null
        }
        return this._mapperSecureUser(user)
    }

    async getUsersWithPaging(query: UserQueryInputType): Promise<PaginationViewModelType<UserSecureViewModel>> {
        let filter = {};
        let searchEmailTerm = query.searchEmailTerm ?? ``;
        let searchLoginTerm = query.searchLoginTerm ?? ``;

        if (searchEmailTerm || searchLoginTerm) {
            const orConditions: any[] = [];

            if (searchEmailTerm) {
                orConditions.push({email: {$regex: searchEmailTerm, $options: 'i'}});
            }

            if (searchLoginTerm) {
                orConditions.push({login: {$regex: searchLoginTerm, $options: 'i'}});
            }

            filter = {
                $or: orConditions
            };
        }
        let pageNumber = Number(query.pageNumber);
        let pageSize = Number(query.pageSize);
        let skip = (pageNumber - 1) * pageSize;


        let users = await userCollection.find(filter)
            .sort({
                [query.sortBy]: query.sortDirection
            })
            .skip(skip)
            .limit(pageSize)
            .toArray();


        let totalCount = await userCollection.countDocuments(filter);


        return {
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            pagesCount: Math.ceil(totalCount / pageSize),
            items: users.map(this._mapperSecureUser),
        }
    }

}