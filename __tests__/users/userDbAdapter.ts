import {SETTINGS} from "../../src/settings";
import {UserFullViewModel} from "../../src/types/input-output-types/user-types";
import {userCollection} from "../../src/db/db";
import {StatusCode} from "../../src/types/status-code-types";
import {mappedUserDbToUserView} from "../../src/features/user/dal/mapper/mappedUserDbToUserView";
import {UserRepository} from "../../src/features/user/dal/UserRepository";

const URL = SETTINGS.PATH.USERS;

type ResponseDb<T> = {
    status: number,
    body: T
}
type Result<T> = Promise<ResponseDb<T>>

let userRepository = new UserRepository();
export const userDbAdapter = {

    getUserByLoginOrEmail: async (loginOrEmail: string) => {
     return await userRepository.getUserByLoginOrEmail(loginOrEmail)
    },

}
