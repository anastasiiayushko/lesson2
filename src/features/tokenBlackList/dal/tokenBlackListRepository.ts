import {tokenBlackListCollection} from "../../../db/db";
import {TokenBlacklistSchemaType} from "../../../db/types/db-token-black-list-type";

export class TokenBlackListRepository {
    setToken = async (token: string, expiresAt: Date): Promise<boolean> => {
        let doc = await tokenBlackListCollection.insertOne({token: token, expiresAt: expiresAt} as TokenBlacklistSchemaType)
        return !!doc.insertedId;
    }
    findToken = async (token: string): Promise<boolean> => {
        let findToken = await tokenBlackListCollection.findOne({token: token});

        return !!findToken;
    }
}