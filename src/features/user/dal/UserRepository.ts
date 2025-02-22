import {userCollection} from "../../../db/db";
import {
    EmailConfirmationDbType,
    RecoveryPasswordConfirmDbType,
    UserSchemaInputType,
    UserSchemaType
} from "../../../db/types/db-user-type";
import {UserFullViewModel, UserSecureViewModel} from "../../../types/input-output-types/user-types";
import {ObjectId} from "mongodb";
import {mappedUserDbToUserView} from "./mapper/mappedUserDbToUserView";
import {injectable} from "inversify";


@injectable()
export class UserRepository {

    async createUser(userInput: UserSchemaInputType): Promise<string> {
        let user = await userCollection.insertOne(userInput as UserSchemaType);
        return user.insertedId.toString()
    }

    async checkUserByLoginOrEmail(login: string, email: string): Promise<UserSecureViewModel | null> {
        let user = await userCollection.findOne({
            $or: [{login: login}, {email: email}]
        });
        if (!user) {
            return null
        }
        return mappedUserDbToUserView.viewFull(user);
    }

    async getUserByLoginOrEmail(loginOrEmail: string): Promise<UserFullViewModel | null> {
        let user = await userCollection.findOne({
            $or: [{login: loginOrEmail}, {email: loginOrEmail}]
        });
        if (!user) {
            return null;
        }
        return mappedUserDbToUserView.viewFull(user)
    }

    async getUserById(id: string): Promise<UserFullViewModel | null> {
        let user = await userCollection.findOne({_id: new ObjectId(id)});
        if (!user) {
            return null;
        }
        return mappedUserDbToUserView.viewFull(user)
    }

    async deleteUserById(id: string): Promise<boolean> {
        let command = await userCollection.deleteOne({_id: new ObjectId(id)});
        return command.deletedCount === 1
    }

    async findUserByConfirmationCode(code: string): Promise<UserFullViewModel | null> {
        let user = await userCollection.findOne({"emailConfirmation.confirmationCode": code});
        return user ? mappedUserDbToUserView.viewFull(user) : null;
    }

    async updateEmailConfirmation(confirmationData: Partial<EmailConfirmationDbType>, userId: string): Promise<boolean> {
        let setOperation: any = {};
        if (confirmationData.hasOwnProperty('isConfirmed')) {
            setOperation['emailConfirmation.isConfirmed'] = confirmationData.isConfirmed;
        }
        if (confirmationData.hasOwnProperty('confirmationCode')) {
            setOperation ['emailConfirmation.confirmationCode'] = confirmationData.confirmationCode;
        }
        if (confirmationData.hasOwnProperty('expirationDate')) {
            setOperation ['emailConfirmation.expirationDate'] = confirmationData.expirationDate;
        }
        let command = await userCollection.updateOne(
            {_id: new ObjectId(userId)},
            {
                $set: setOperation
            })
        return command.matchedCount > 1;

    }

    async setRecoveryPasswordConfirmation(email: string, recoveryConfirmData: RecoveryPasswordConfirmDbType): Promise<boolean> {
        const user = await userCollection.findOneAndUpdate(
            {email: email},
            {$set: {recoveryPasswordConfirm: recoveryConfirmData}}
        );
        return !!user;
    }

    async findUserByRecoveryCode(code: string): Promise<UserFullViewModel | null> {
        let user = await userCollection.findOne({"recoveryPasswordConfirm.recoveryCode": code});
        return user ? mappedUserDbToUserView.viewFull(user) : null;
    }

    async confirmPasswordReset(userId: string, newPassword: string): Promise<boolean> {
        const user = await userCollection.findOneAndUpdate(
            {_id: new ObjectId(userId)},
            {$set: {password: newPassword, 'recoveryPasswordConfirm.isConfirmed': true}}
        );
        return !!user;
    }
}


