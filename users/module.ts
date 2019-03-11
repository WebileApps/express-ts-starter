import * as UserModel from "./model";
export interface User {
    name: string;
    id : string | number;
}

const users : Array<User> = [
    { name: "Admin", id : 1},
    { name: "Moderator", id : 2}
]
export async function list() : Promise<Array<User>> {
    return new Promise( resolve => {
        setTimeout(_ => resolve(users), 1000);
    })
}

export async function getOrCreateUser(uniqueId : string) {
    let user = await findByUserName(uniqueId);
    if (!user) {
        user = await UserModel.create({"username" : uniqueId, role: "user"});
        console.log(`User created`, user);
    }
    return user;
}

export async function findByUserName(username : string) {
    return await UserModel.findOne({username}).exec();
}