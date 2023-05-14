import * as jose from 'jose';
import * as dotenv from "dotenv";
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
import { response } from 'express';
declare var process: {
    env: {
        SECRET: string;
        SECRET_PASS: string;
        SECRET_EMAIL: string;
        SECRET_NAME: string;
        SECRET_LASTNAME: string;
    };
};
dotenv.config({ path: __dirname + "../../.env" });
let users: any;
interface usersObejct {
    email: string,
    password: string,
    name: string,
    lastName: string,
}
export default class UsersDao {

    static connectionDB: any;
    static secret = new TextEncoder().encode(process.env.SECRET);
    static alg: jose.JWTHeaderParameters = { alg: 'HS256' };
    static async connDB(conn: any) {
        this.connectionDB = conn;
        if (users) return;
        try {
            users = await conn.db("Main").collection("Users");
            await conn.db("Main").collection("Users").createIndex({
                email: 1
            }, { unique: true });
        } catch (e) {
            return Promise.reject(e)
        }
        return Promise.resolve({
            message: "Connection to users established"
        });
    }

    static async getUser(email: string): Promise<usersObejct[]> {
        let query = {
            email: "",
        }
        let emailEncrypted: string = "";
        await this.encryptData(email, process.env.SECRET_EMAIL).then((res: string) => {
            emailEncrypted = res;
        }).catch((e: any) => {
            return Promise.reject({
                error: `Error in encrypting email: ${e}`
            })
        })
        query.email = emailEncrypted;
        let cursor: any;
        let usersList: [usersObejct] = [{
            email: "",
            password: "",
            name: "",
            lastName: "",
        }];
        try {
            cursor = await users.find(query)
        } catch (e: any) {
            return Promise.reject({
                error: `Error in finding items: ${e}`
            })
        };
        let displayCursor;
        try {
            displayCursor = await cursor
                .limit(20)
                .skip(20 * 0);
        } catch (e: any) {
            return Promise.reject({
                error: `Error in finding items: ${e}`
            })
        };

        try {
            usersList = await displayCursor.toArray();
        } catch (e: any) {
            return Promise.reject({
                error: `Error in finding items: ${e}`
            })
        };
        return Promise.resolve(usersList);
    }



    static async createToken(user: usersObejct): Promise<string> {
        const jwt = await new jose.SignJWT({ user })
            .setProtectedHeader(this.alg)
            .setIssuedAt()
            .setExpirationTime('2h')
            .sign(this.secret).catch((e: any) => {
                return Promise.reject({
                    error: `Error in creating token: ${e}`
                })
            })
        return Promise.resolve(jwt);
    }
    static async encryptData(data: string, secret: string = process.env.SECRET_PASS): Promise<string> {
        let token: string = "";
        try {
            let hash = sha256(data + secret);
            let hmac = hmacSHA512(hash, secret);
            token = Base64.stringify(hmac);
        } catch (e) {
            return Promise.reject(e)
        }

        return Promise.resolve(token);
    }



    static async createUser(user: usersObejct): Promise<{}> {
        let password: string = "";
        let email: string = "";
        let name: string = "";
        let lastName: string = "";
        await this.encryptData(user.password, process.env.SECRET_PASS).then((response) => {
            password = response;
        }).catch((error) => {
            return Promise.reject(error);
        });

        await this.encryptData(user.email, process.env.SECRET_EMAIL).then((response: string) => {
            email = response;
        }).catch((error: any) => {
            return Promise.reject(error)
        })
        await this.encryptData(user.name, process.env.SECRET_NAME).then((response: string) => {
            name = response;
        }).catch((error: any) => {
            return Promise.reject(error)
        })

        await this.encryptData(user.lastName, process.env.SECRET_LASTNAME).then((response: string) => {
            lastName = response;
        }).catch((error: any) => {
            return Promise.reject(error)
        })



        user.email = email;
        user.password = password;
        user.name = name;
        user.lastName = lastName;
        try {
            await users.insertOne(user)
        } catch (e: any) {
            return Promise.reject(e)
        }


        return Promise.resolve({
            message: "User created"
        });
    }

    static async verifyToken(token: string): Promise<string> {
        

        await jose.jwtVerify(token, this.secret).then((response: jose.JWTVerifyResult) => {

            if (response.payload.iat !== undefined && response.payload.exp !== undefined) {
                if (response.payload.iat >= response.payload.exp) {
                    return Promise.reject("Token Expired");
                }
            }
        }).catch((error: any) => {
            return Promise.reject(error)
        })

        return Promise.resolve("good");

    }

}