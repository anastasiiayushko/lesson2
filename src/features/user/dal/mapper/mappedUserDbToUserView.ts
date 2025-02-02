import {UserSchemaType} from "../../../../db/types/db-user-type";
import {UserFullViewModel} from "../../../../types/input-output-types/user-types";

export const mappedUserDbToUserView = {
    viewFull: (item: UserSchemaType): UserFullViewModel => {
        return {
            id: item._id.toString(),
            login: item.login,
            email: item.email,
            password: item.password,
            createdAt: item.createdAt,
            emailConfirmation: item.emailConfirmation

        }
    }
}