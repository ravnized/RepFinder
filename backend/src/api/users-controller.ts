import UsersDao from "../dao/usersDao";
interface usersObejct {
    email: string,
    password: string,
    name: string,
    lastName: string,
    role: number,
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
            role: 0,
        };
        await UsersDao.getUser(email).then((response: any) => {
            if (response.length === 0) return Promise.reject({ error: "User not found" });
            user = response[0];
        }).catch((error) => {
            return Promise.reject(error);
        });

        await UsersDao.encryptData(password).then((passwordReturned: string) => {
            if (passwordReturned !== user.password) {
                return Promise.reject({
                    error: "Wrong password"
                })
            }
        })

        let token: string = "";
        await UsersDao.createToken(user).then((response) => {
            token = response;
        }).catch((error) => {
            return Promise.reject(error);
        });
        return Promise.resolve(token);
    }
    static async register(req: any): Promise<{}> {
        let email: string = req.body.email;
        let password: string = req.body.password;
        let name: string = req.body.name;
        let lastName: string = req.body.lastName;
        let role: number = 0;
        let user: usersObejct = {
            email: "",
            password: "",
            name: "",
            lastName: "",
            role: 0,
        };

        user = {
            email: email,
            password: password,
            name: name,
            lastName: lastName,
            role: role,

        };


        await UsersDao.createUser(user).then((response) => {
            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject({
                error: `Error in creating user: ${error}`
            });
        });


        return Promise.resolve({
            message: "User created successfully"
        });
    }
    static async verifyToken(req: any): Promise<{}> {
        let responseString: string = "";
        await UsersDao.verifyToken(req.body.token).then((response) => {
            responseString = response;
        }
        ).catch((error) => {
            return Promise.reject(error);
        }
        );
        return Promise.resolve({
            response: responseString
        });
    }
}