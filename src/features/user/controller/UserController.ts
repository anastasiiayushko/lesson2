import {Request, Response} from "express";
import {UserService} from "../service/UserService";
import {StatusCode} from "../../../types/status-code-types";
import {UserInputModel, UserQueryInputType, UserSecureViewModel} from "../../../types/input-output-types/user-types";
import {UserQueryRepository} from "../dal/UserQueryRepository";
import {ApiErrorResultType} from "../../../types/output-error-types";
import {postQueryPagingDef} from "../helpers/postQueryPagingDef";
import {PaginationViewModelType} from "../../../types/input-output-types/pagination-output-types";

export class UserController {
    private readonly _userService = new UserService();
    private readonly _userQueryRepo = new UserQueryRepository();

    createUser = async (req: Request<{}, {}, UserInputModel>,
                        res: Response<ApiErrorResultType | UserSecureViewModel>) => {
        let response = await this._userService.createUser(req.body);
        if (response.errors && !!response.errors.length) {
            res.status(StatusCode.BAD_REQUEST_400).json({
                errorsMessages: response.errors
            })
        }


        let user = await this._userQueryRepo.getUserById(response.userId!);
        res.status(StatusCode.CREATED_201).json(user!);


    }

    deleteUserById = async (req: Request<{ id: string }>, res: Response) => {
        let isDeleted = await this._userService.deleteUser(req.params.id);
        if (isDeleted) {
            res.sendStatus(StatusCode.NO_CONTENT_204);
            return;
        }
        res.sendStatus(StatusCode.NOT_FOUND__404);

    }

    getUsersWithPaging = async (req: Request<{}, {}, {}, {}>,
                                res: Response<PaginationViewModelType<UserSecureViewModel>>) => {
        let query = req.query as UserQueryInputType;
        let queryDef = postQueryPagingDef(query);
        let usersWithPaging = await this._userQueryRepo.getUsersWithPaging(queryDef);
        res.status(StatusCode.OK_200).json(usersWithPaging);

    }
}