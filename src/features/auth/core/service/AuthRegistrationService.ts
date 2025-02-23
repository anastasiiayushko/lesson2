import {AuthRegSendEmailPort} from "../port/AuthRegSendEmailPort";
import {UserService} from "../../../user/service/UserService";
import {UserInputModel} from "../../../../types/input-output-types/user-types";
import {ServiceResponseType} from "../../../../types/service-response-type";
import {StatusCode} from "../../../../types/status-code-types";
import {UserRepository} from "../../../user/dal/UserRepository";
import {UserConfirmData} from "../dtos/userConfirmData";
import {inject, injectable} from "inversify";
import {AuthRegSendEmailAdapter} from "../../adapter/AuthRegSendEmailAdapter";


@injectable()
export class AuthRegistrationService {

    constructor(@inject(AuthRegSendEmailAdapter) protected authSendEmailAdapter: AuthRegSendEmailPort,
                protected userService: UserService,
                protected userRepository: UserRepository,
    ) {}

    async registration(userInput: UserInputModel): Promise<ServiceResponseType> {
        let result = await this.userService.createUser(userInput, false);
        if (result.extensions?.length || !result.data) {
            return {
                status: result.status,
                extensions: result.extensions,
                data: null
            }
        }

        let emailTo = userInput.email;
        let confirmedCode = result.data.confirmationCode;
        this.authSendEmailAdapter.confirmRegistration(emailTo, confirmedCode);

        return {
            status: StatusCode.NO_CONTENT_204,
            data: null,
            extensions: []
        }
    }

    async registrationConfirmed(code: string): Promise<ServiceResponseType<{ isConfirmed: boolean }>> {
        let userByCode = await this.userRepository.findUserByConfirmationCode(code);

        if (!userByCode) {
            return {
                status: StatusCode.BAD_REQUEST_400,
                data: {isConfirmed: false},
                extensions: [{field: "code", message: "confirmation code is incorrect"}]
            }
        }

        if ((new Date() > userByCode.emailConfirmation.expirationDate) || userByCode.emailConfirmation.isConfirmed) {
            return {
                status: StatusCode.BAD_REQUEST_400,
                data: {isConfirmed: false},
                extensions: [{field: "code", message: "confirmation code is incorrect"}]
            }
        }

        await this.userRepository.updateEmailConfirmation({isConfirmed: true}, userByCode.id);
        return {
            status: StatusCode.NO_CONTENT_204,
            extensions: [],
            data: {isConfirmed: true},
        }
    }

    async registrationEmailResending(email: string): Promise<ServiceResponseType<{ isResending: boolean }>> {
        let userByEmail = await this.userRepository.getUserByLoginOrEmail(email);
        if (!userByEmail) {
            return {
                status: StatusCode.BAD_REQUEST_400,
                extensions: [{field: "email", message: "email invalid"}],
                data: {isResending: false}
            }
        }
        if (userByEmail.emailConfirmation.isConfirmed) {
            return {
                status: StatusCode.BAD_REQUEST_400,
                extensions: [{field: "email", message: "email is already confirmed"}],
                data: {isResending: false}
            }
        }

        let userResending = new UserConfirmData();
        await this.userRepository.updateEmailConfirmation(userResending, userByEmail.id);

        this.authSendEmailAdapter.confirmRegistration(email, userResending.confirmationCode);
        return {
            status: StatusCode.NO_CONTENT_204,
            extensions: [],
            data: {isResending: true}
        }
    }
}