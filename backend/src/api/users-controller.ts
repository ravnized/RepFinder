import UsersDao from "../dao/usersDao";
interface usersObejct {
    email: string,
    password: string,
    name: string,
    lastName: string,
}
export default class UsersController {
    static async login(req: any): Promise<string> {
        let email: string = req.body.email;
        let password: string = req.body.password;
        let user: usersObejct = {
            email: "",
            password: "",
            name: "",
            lastName: "",
        };
        await UsersDao.getUser(email).then((response: any) => {
            if(response.length === 0) return Promise.reject({ error: "User not found" });
            user = response[0];
        }).catch((error) => {
            return Promise.reject(error);
        });
        if (user.password !== password) return Promise.reject({ error: "Wrong password" });
        let token: string = "";
        await UsersDao.createToken(user).then((response) => {
            token = response;
        }).catch((error) => {
            return Promise.reject(error);
        });
        return Promise.resolve(token);
    }
}
