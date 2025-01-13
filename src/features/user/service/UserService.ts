import {UserRepository} from "../dal/UserRepository";
import {UserInputModel} from "../../../types/input-output-types/user-types";
import bcrypt from "bcrypt";
import {ErrorItemType} from "../../../types/output-error-types";
import {StatusCode} from "../../../types/status-code-types";
import {ServiceResponseType} from "../../../types/service-response-type";


type UserCreatedType = {
    errors: ErrorItemType[] | null,
    userId: string | null
}
const SALT_ROUND = 5;

export class UserService {
    private readonly _userRepo = new UserRepository();

    createUser = async (userInput: UserInputModel): Promise<UserCreatedType> => {
        let errors: ErrorItemType[] = [];

        let findUser = await this._userRepo.checkUserByLoginOrEmail(userInput.login, userInput.email);

        if (findUser) {
            if (findUser.login === userInput.login) {
                errors.push({message: "the login is not unique", field: "login"})
            }
            if (findUser.email === userInput.email) {
                errors.push({message: "the email is not unique", field: "email"})

            }
            return {errors, userId: null}
        }


        let salt = await bcrypt.genSalt(SALT_ROUND);
        let passwordHash = await bcrypt.hash(userInput.password, salt);
        let userBody = {
            email: userInput.email,
            login: userInput.login,
            password: passwordHash,
            createdAt: new Date().toISOString()
        }
        let userId = await this._userRepo.createUser(userBody);
        return {errors: null, userId: userId}
    }

    checkCredentialsUser = async (loginOrEmail: string, password: string):
        Promise<ServiceResponseType<{ userId: string } | null>> => {
        let findUser = await this._userRepo.getUserByLoginOrEmail(loginOrEmail);
        if (!findUser) {
            return {
                status: StatusCode.NOT_FOUND__404,
                data: null,
                extensions: []

            }
        }

        let comparePassword = await bcrypt.compare(password, findUser.password);
        if (comparePassword) {
            return {
                status: StatusCode.OK_200,
                data: {userId: findUser.id},
                extensions: []
            }
        }

        return {
            status: StatusCode.UNAUTHORIZED_401,
            data: null,
            extensions: []
        }

    }

    deleteUser = async (id: string): Promise<boolean> => {
        let deleted = await this._userRepo.deleteUserById(id);
        return deleted;
    }


}