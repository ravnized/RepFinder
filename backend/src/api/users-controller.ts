import UsersDao from "../dao/usersDao";
import * as jose from 'jose';
interface usersObejct {
    email: string,
    password: string,
    name: string,
    lastName: string,
    role: number,
}
export default class UsersController {
    /**
     * @param req request
     * @returns Promise with the token or error
     * @description Function for login
     */
    static async login(req: any): Promise<{ token: string }> {
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
        return Promise.resolve({
            token: token
        });
    }
    /**
     * @param req request
     * @returns Promise object
     * @description Function for register
     */
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
                error: `Error in creating user: ${error.error}`
            });
        });


        return Promise.resolve({
            message: "User created successfully"
        });
    }

    /**
     * @param req request
     * @returns Promise object
     * @description Function for verify token
     */
    static async verifyToken(req: any): Promise<{}> {

        let responseString: boolean = false;
        let data: jose.JWTPayload = {};

        await UsersDao.verifyToken(req.body.token).then((response) => {
            responseString = response.success;
            data = response.data;
            //console.log(response);
        }
        ).catch((e) => {
            return Promise.reject({
                response: e.error,
                data: {}
            });
        }
        );
        return Promise.resolve({
            response: responseString,
            data: data
        });
    }
    /**
     * @param req request
     * @returns Promise object
     * @description Function for get role
     */
    static async getRole(req: any): Promise<{}> {
        await UsersDao.verifyToken(req.header('token')).then(async (response: {
            success: boolean,
            error: string,
            data: jose.JWTPayload
        }) => {
            //console.log(req.header('token'));
            if (response.success) {
                let user: any = response.data.user;

                if (user.role === 0) {
                    return Promise.reject({
                        success: false,
                        error: "User not authorized"
                    })
                } else {

                    await UsersDao.getRole(user.email).then((response: {
                        success: boolean,
                        error: string,
                        role: number
                    }) => {
                        if (response.role !== 1) {
                            return Promise.reject({
                                success: false,
                                error: "User not authorized"
                            })
                        }

                    }).catch((e: any) => {
                        return Promise.reject(e)
                    });

                }
            }
        }).catch((e: any) => {
            return Promise.reject(e)
        })
        return Promise.resolve({
            success: true,
            error: ""
        })
    }

    static async getEmail(req: any): Promise<{}> {
        let email = "";
        await UsersDao.verifyToken(req.header('token')).then(async (response: {
            success: boolean,
            error: string,
            data: jose.JWTPayload
        }) => {
            //console.log(req.header('token'));
            if (response.success) {
                let user: any = response.data.user;

                email = user.email;
            }
        }).catch((e: any) => {
            return Promise.reject(e)
        })
        return Promise.resolve({
            success: true,
            error: "",
            email: email
        })
    }
    static async getRoleWs(msg: any): Promise<{}> {
        await UsersDao.verifyToken(msg.token).then(async (response: {
            success: boolean,
            error: string,
            data: jose.JWTPayload
        }) => {
            //console.log(req.header('token'));
            if (response.success) {
                let user: any = response.data.user;

                if (user.role === 0) {
                    return Promise.reject({
                        success: false,
                        error: "User not authorized"
                    })
                } else {

                    await UsersDao.getRole(user.email).then((response: {
                        success: boolean,
                        error: string,
                        role: number
                    }) => {
                        if (response.role !== 1) {
                            return Promise.reject({
                                success: false,
                                error: "User not authorized"
                            })
                        }

                    }).catch((e: any) => {
                        return Promise.reject(e)
                    });

                }
            }
        }).catch((e: any) => {
            return Promise.reject(e)
        })
        return Promise.resolve({
            success: true,
            error: ""
        })
    }
}