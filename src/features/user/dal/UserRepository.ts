import {userCollection} from "../../../db/db";
import {UserSchemaInputType, UserSchemaType} from "../../../db/types/db-user-type";
import {UserFullViewModel, UserSecureViewModel} from "../../../types/input-output-types/user-types";
import {ObjectId} from "mongodb";

export class UserRepository {
    _mapperUser = (item: UserSchemaType): UserFullViewModel => {
        return {
            id: item._id.toString(),
            login: item.login,
            email: item.email,
            password: item.password,
            createdAt: item.createdAt,
        }
    }

    createUser = async (userInput: UserSchemaInputType): Promise<string> => {
        let user = await userCollection.insertOne(userInput as UserSchemaType);
        return user.insertedId.toString()
    }
    checkUserByLoginOrEmail = async (login: string, email: string): Promise<UserSecureViewModel | null> => {
        let user = await userCollection.findOne({
            $or: [{login: login}, {email: email}]
        });
        if (!user) {
            return null
        }
        return this._mapperUser(user);
    }

    getUserByLoginOrEmail = async (loginOrEmail: string): Promise<UserFullViewModel | null> => {
        let user = await userCollection.findOne({
            $or: [{login: loginOrEmail}, {email: loginOrEmail}]
        });
        if (!user) {
            return null;
        }
        return this._mapperUser(user);
    }

    getUserById = async (id: string): Promise<UserFullViewModel | null> => {
        let user = await userCollection.findOne({_id: new ObjectId(id)});
        if (!user) {
            return null;
        }
        return this._mapperUser(user);
    }

    deleteUserById = async (id: string): Promise<boolean> => {
        let command = await userCollection.deleteOne({_id: new ObjectId(id)});
        return command.deletedCount === 1
    }

}

