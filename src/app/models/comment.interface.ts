import { UserInterface } from "./user.interface";

export interface CommentInterface {
    id?: string;
    content: string;
    owner: UserInterface
}