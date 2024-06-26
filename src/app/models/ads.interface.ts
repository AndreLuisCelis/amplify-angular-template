import { CommentInterface } from "./comment.interface";
import { UserInterface } from "./user.interface";


export interface AdsInterface {
    title: string;
    description: string;
    images?: string[] | any;
    comments?: CommentInterface[];
    userId?: UserInterface["id"];
    user?: UserInterface;
    srcImageExpire?: string | null;
    srcPublicImage?: string | null;
    createdAt?: string 
}

export interface EditAdsInterface extends AdsInterface {
    id: string;
}