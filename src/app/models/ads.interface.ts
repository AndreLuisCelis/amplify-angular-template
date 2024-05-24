import { CommentInterface } from "./comment.interface";
import { UserInterface } from "./user.interface";


export interface AdsInterface {
    title: string;
    description: string;
    images?: string[] | any;
    comments?: CommentInterface[];
    ownerId?: UserInterface["id"];
    srcImage?: string | null;
}

export interface EditAdsInterface extends AdsInterface {
    id: string;
}