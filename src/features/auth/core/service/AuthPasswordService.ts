import {ServiceResponseType} from "../../../../types/service-response-type";
import {StatusCode} from "../../../../types/status-code-types";
import {UserRepository} from "../../../user/dal/UserRepository";
import {randomUUID} from "crypto";
import {add} from "date-fns";
import {SETTINGS} from "../../../../settings";
import {AuthRegSendEmailPort} from "../port/AuthRegSendEmailPort";
import bcrypt from "bcrypt";
import {inject, injectable} from "inversify";
import {AuthRegSendEmailAdapter} from "../../adapter/AuthRegSendEmailAdapter";


@injectable()
export class AuthPasswordService {

    constructor(protected userRepository: UserRepository,
                @inject(AuthRegSendEmailAdapter)protected authSendEmailAdapter: AuthRegSendEmailPort) {
    }

    async passwordRecovery(email: string): Promise<ServiceResponseType<null>> {
        let userByEmail = await this.userRepository.getUserByLoginOrEmail(email);
        if (!userByEmail) {
            return {
                status: StatusCode.NO_CONTENT_204,
                extensions: [],
                data: null
            }
        }
        const recoveryCode = randomUUID();
        await this.userRepository.setRecoveryPasswordConfirmation(
            email, {
                expirationDate: add(new Date(), {
                    hours: SETTINGS.RECOVERY_PASSWORD_EXPIRATION_DATE_HOURS,
                    minutes: SETTINGS.RECOVERY_PASSWORD_EXPIRATION_DATE_MIN,
                    // seconds:
                }),
                recoveryCode: recoveryCode,
                isConfirmed: false
            });
        this.authSendEmailAdapter.recoveryPassword(email, recoveryCode)
        return {
            status: StatusCode.NO_CONTENT_204,
            extensions: [],
            data: null
        }
    }

    async changePassword(password: string, recoveryCode: string): Promise<ServiceResponseType<null>> {
        const userByCode = await this.userRepository.findUserByRecoveryCode(recoveryCode);
        if (!userByCode) {
            return {
                status: StatusCode.BAD_REQUEST_400,
                data: null, extensions: [{field: "recoveryCode", message: "Not found user by recoveryCode"}],
            }
        }
        if (new Date() > userByCode.recoveryPasswordConfirm.expirationDate || userByCode.recoveryPasswordConfirm.isConfirmed) {
            return {
                status: StatusCode.BAD_REQUEST_400,
                data: null, extensions: [{field: "recoveryPasswordConfirm", message: ""}],
            }
        }
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);

        await this.userRepository.confirmPasswordReset(userByCode.id, newPassword);
        return {
            status: StatusCode.NO_CONTENT_204,
            data: null, extensions: [],
        }
    }
}