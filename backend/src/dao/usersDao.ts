export default class UsersDao {
    static users: any;
    static connectionDB: any;
    static async connDB(conn: any) {
        this.connectionDB = conn;
        if (this.users) return;
        try {
            this.users = await conn.db("Main").collection("Users");
            console.log(`Users collection initialized`);
        } catch (e) {
            console.error(`unable to enstablish a collection handle ${e}`);
        }
    }
}