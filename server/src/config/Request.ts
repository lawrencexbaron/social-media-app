import { User } from "../models/User";

declare module 'express' {
    export interface Request {
        user?: User;
        files?: any;
        _doc?: any;
    }
}