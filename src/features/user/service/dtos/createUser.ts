import {randomUUID} from "crypto";
import {add} from "date-fns"
import {SETTINGS} from "../../../../settings";

export class CreateUser {
    login: string;
    email: string;
    password: string;
    createdAt: string;
    emailConfirmation: {
        confirmationCode: string;
        expirationDate: Date;
        isConfirmed: boolean;
    }
    recoveryPasswordConfirm: {
        recoveryCode: string | null;
        expirationDate: Date | null;
        isConfirmed: boolean;
    }

    constructor(login: string, email: string, passwordHash: string, isConfirmed: boolean) {
        this.login = login
        this.email = email
        this.password = passwordHash
        this.createdAt = new Date().toISOString()
        this.emailConfirmation = {
            expirationDate: add(new Date(), {
                hours: SETTINGS.AUTH_EXPIRATION_DATE_HOURS,
                minutes: SETTINGS.AUTH_EXPIRATION_DATE_MIN
            }),
            confirmationCode: randomUUID(),
            isConfirmed: isConfirmed
        }
        this.recoveryPasswordConfirm = {
            recoveryCode: null, expirationDate: null, isConfirmed: false
        }
    }
}