import { CommentInterface } from "./comment.interface";
import { UserInterface } from "./user.interface";

export interface AdsInterface {
    id: string;
    title?: string;
    description?: string;
    images?: string[];
    comments?: CommentInterface[];
    owner?: UserInterface["id"]
}