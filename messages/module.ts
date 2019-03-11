import * as MessageModel from "./model";
import { findByUserName } from "../users/module";
import { ObjectID } from "bson";

export async function createMessage(msg : string, userName : string, type = "text", fileName: string = "") {
    const user = await findByUserName(userName);
    if (!user) {
        throw new Error("No such username found");
    }
    return await MessageModel.create({ userId : user._id, content: msg, type , fileName});
}

export async function getMessageHistory(userId : string) {
    const messages = await MessageModel.find({}).sort({createdAt: -1}).limit(20).exec();
    const ret = messages.map(message => message.toJSON())
    ret.reverse();
    return ret;
}

export async function getLatestUsers() {
    await MessageModel.find({}).sort({createdAt: -1}).exec();
}