import 'reflect-metadata';
import {Container} from "inversify";

export const container: Container = new Container({autoBindInjectable: true});
