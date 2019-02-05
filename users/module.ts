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