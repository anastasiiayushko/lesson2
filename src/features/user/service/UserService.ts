import {UserRepository} from "../dal/UserRepository";
import {UserInputModel} from "../../../types/input-output-types/user-types";
import bcrypt from "bcrypt";
import {ErrorItemType} from "../../../types/output-error-types";


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

    checkCredentialsUser = async (loginOrEmail: string, password: string): Promise<boolean> => {
        let findUser = await this._userRepo.getUserByLoginOrEmail(loginOrEmail);
        if (!findUser) {
            return false
        }

        let comparePassword = await bcrypt.compare(password, findUser.password);
        return comparePassword;

    }

    deleteUser = async (id: string): Promise<boolean> => {
        let deleted = await this._userRepo.deleteUserById(id);
        return deleted;
    }


}