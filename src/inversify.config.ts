import 'reflect-metadata';
import {Container} from "inversify";
import {AuthRegSendEmailPort} from "./features/auth/core/port/AuthRegSendEmailPort";
import {AuthRegSendEmailAdapter} from "./features/auth/adapter/AuthRegSendEmailAdapter";
import {CommentsRepository} from "./features/comment/dal/CommentsRepository";
import {CommentsRepositoryMongo} from "./features/comment/dal/CommentsRepositoryMongo";
import {CommentsQueryRepository} from "./features/comment/dal/CommentsQueryRepository";
import {CommentsQueryRepositoryMongo} from "./features/comment/dal/CommentsQueryRepositoryMongo";

export const container: Container = new Container({autoBindInjectable: true});
container.bind<AuthRegSendEmailPort>(AuthRegSendEmailAdapter).to(AuthRegSendEmailAdapter)
container.bind<CommentsRepository>(CommentsRepositoryMongo).to(CommentsRepositoryMongo)
container.bind<CommentsQueryRepository>(CommentsQueryRepositoryMongo).to(CommentsQueryRepositoryMongo)