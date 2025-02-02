import {add} from "date-fns";
import {randomUUID} from "crypto";
import {SETTINGS} from "../../../../settings";

export class UserConfirmData {
    confirmationCode: string;
    expirationDate: Date;

    constructor() {
        this.expirationDate = add(new Date(), {
            hours: SETTINGS.AUTH_EXPIRATION_DATE_HOURS,
            minutes: SETTINGS.AUTH_EXPIRATION_DATE_MIN
        })
        this.confirmationCode = randomUUID();
    }


}