import {UserRepository} from "../dal/UserRepository";
import {UserFullViewModel, UserInputModel} from "../../../types/input-output-types/user-types";
import bcrypt from "bcrypt";
import {ErrorItemType} from "../../../types/output-error-types";
import {StatusCode} from "../../../types/status-code-types";
import {ServiceResponseType} from "../../../types/service-response-type";
import {CreateUser} from "./dtos/createUser";
import {injectable} from "inversify";


type UserCreatedType = {

    userId: string, confirmationCode: string
}
const SALT_ROUND = 5;


@injectable()
export class UserService {
    constructor(protected userRepository: UserRepository) {}

    async createUser(userInput: UserInputModel, isConfirmed: boolean): Promise<ServiceResponseType<UserCreatedType | null>> {
        let errors: ErrorItemType[] = [];

        let findUser = await this.userRepository.checkUserByLoginOrEmail(userInput.login, userInput.email);

        if (findUser) {
            if (findUser.login === userInput.login) {
                errors.push({message: "the login is not unique", field: "login"})
            }
            if (findUser.email === userInput.email) {
                errors.push({message: "the email is not unique", field: "email"})
            }

            return {
                extensions: errors,
                data: null,
                status: StatusCode.BAD_REQUEST_400
            }

        }


        let salt = await bcrypt.genSalt(SALT_ROUND);
        let passwordHash = await bcrypt.hash(userInput.password, salt);

        let user = new CreateUser(userInput.login, userInput.email, passwordHash, isConfirmed)
        let userId = await this.userRepository.createUser(user);
        return {
            extensions: [],
            data: {userId: userId, confirmationCode: user.emailConfirmation.confirmationCode},
            status: StatusCode.CREATED_201
        }
    }

    async checkCredentialsUser(loginOrEmail: string, password: string):
        Promise<ServiceResponseType<{ userId: string } | null>> {
        let findUser = await this.userRepository.getUserByLoginOrEmail(loginOrEmail);
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

    async deleteUser(id: string): Promise<boolean> {
        let deleted = await this.userRepository.deleteUserById(id);
        return deleted;
    }

    async getUserById(id: string): Promise<UserFullViewModel | null> {
        return await this.userRepository.getUserById(id)
    }


}