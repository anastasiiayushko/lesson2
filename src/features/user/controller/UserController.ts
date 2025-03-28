import {Request, Response} from "express";
import {UserService} from "../service/UserService";
import {StatusCode} from "../../../types/status-code-types";
import {UserInputModel, UserQueryInputType, UserSecureViewModel} from "../../../types/input-output-types/user-types";
import {UserQueryRepository} from "../dal/UserQueryRepository";
import {ApiErrorResultType} from "../../../types/output-error-types";
import {userQueryPagingDef} from "../helpers/userQueryPagingDef";
import {PaginationViewModelType} from "../../../types/input-output-types/pagination-output-types";
import {injectable} from "inversify";

@injectable()
export class UserController {

    constructor(
        protected userService: UserService,
        protected userQueryRepository: UserQueryRepository,
    ) {
    }

    async createUser(req: Request<{}, {}, UserInputModel>,
                     res: Response<ApiErrorResultType | UserSecureViewModel>) {
        let result = await this.userService.createUser(req.body, true);
        if (result.extensions?.length || !result.data) {
            res.status(result.status).json({
                errorsMessages: result.extensions
            })
            return;
        }

        let user = await this.userQueryRepository.getUserById(result.data.userId);
        res.status(StatusCode.CREATED_201).json(user!);


    }

    async deleteUserById(req: Request<{ id: string }>, res: Response) {
        let isDeleted = await this.userService.deleteUser(req.params.id);
        if (isDeleted) {
            res.sendStatus(StatusCode.NO_CONTENT_204);
            return;
        }
        res.sendStatus(StatusCode.NOT_FOUND__404);

    }

    async getUsersWithPaging(req: Request<{}, {}, {}, {}>,
                             res: Response<PaginationViewModelType<UserSecureViewModel>>) {
        let query = req.query as UserQueryInputType;
        let queryDef = userQueryPagingDef(query);
        let usersWithPaging = await this.userQueryRepository.getUsersWithPaging(queryDef);
        res.status(StatusCode.OK_200).json(usersWithPaging);

    }
}