import * as MessageModel from "./model";
import { findByUserName } from "../users/module";

export async function createMessage(msg : string, userName : string, type = "text", fileName: string = "") {
    const user = await findByUserName(userName);
    if (!user) {
        throw new Error("No such username found");
    }
    return await MessageModel.create({ userId : user._id, content: msg, type , fileName});
}