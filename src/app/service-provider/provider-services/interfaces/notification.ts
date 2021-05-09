import { message } from "../../transaction/transaction.page";

export interface notification {
    _id: string;
    receiver: string;
    message:string;
    createdAt: string;
    opened: boolean;
}