import * as jose from 'jose';
import * as dotenv from "dotenv";
declare var process: {
    env: {
        SECRET: string;
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
        query.email = email
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
}