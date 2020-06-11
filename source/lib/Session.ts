import { UUID } from "./id/UUID.ts";
import Connection from "./sqllite/Connection.ts";
import BaseField from "./sqllite/BaseField.ts";
import { connect } from "https://raw.githubusercontent.com/rahmanfadhil/cotton/master/mod.ts";


export class DBSession {
    UUID: string = "NOID";
    private uncheckedUUID: string | undefined = "";
    static con: Connection;

    constructor(proclaimedSessionID: string | undefined) {
        this.uncheckedUUID = proclaimedSessionID;

        DBSession.con = new Connection('/data/db.sqlite');
        this.installDB().then(() => {
            this.checkUUID();
        });
    }

    private UUIDchecked = false;
    /**
     * Checks if UUID is valid and initializing is done.
     */
    private checkUUID(): Promise<void> {
        return new Promise((resolve) => {
            if (this.UUIDchecked) resolve();
            this.installDB().then(async () => {
                //console.log("Check ID Exists")
                this.checkIfIdExists(this.uncheckedUUID).then(() => {
                    //console.log("Found ID in DB!")
                    this.UUID = this.uncheckedUUID as string;
                    this.UUIDchecked = true;
                    resolve();
                }).catch(async (reason) => {
                    console.log("Reason: " + reason)

                    this.UUID = UUID.generate(256);

                    var db = await connect(DBSession.con.connectionobj)
                    db.queryBuilder('session')
                        .replace({ essid: this.UUID, created_at: Date.now() })
                        .execute();
                    db.disconnect();
                    this.UUIDchecked = true;
                    resolve();
                })
            });
        })
    }

    openSession(): Promise<DBSessionStorage> {
        return new Promise((resolve) => {
            resolve(new DBSessionStorage(this));
        });
    }

    private isInstalled = false;
    public async installDB(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (this.isInstalled) { resolve(true); return; }
            DBSession.con.checkTableExists('session').catch(async () => {
                DBSession.con.createTable("session", [
                    new BaseField('essid').isUnique().setType("VARCHAR(256)"),
                    new BaseField('created_at').setType('BIGNUMBER')
                ])
            })
            DBSession.con.checkTableExists('session_data').catch(() => {
                DBSession.con.createTable("session_data", [
                    new BaseField('essid').isUnique().setType("VARCHAR(256)"),
                    new BaseField('data').isUnique().setType("VARCHAR(1524)")
                ])
            })
            resolve(true);
        });
    }

    /**
     * Fully removes the Session from the Database!!
     */
    async deleteSession() {
        this.installDB().then(async () => {
            var db = await connect(DBSession.con.connectionobj)

            await db.queryBuilder('session')
                .where("essid", this.UUID)
                .execute().then(async qr => {
                    if (qr.records.length >= 1)
                        await db.queryBuilder('session')
                            .where("essid", this.UUID)
                            .delete()
                            .execute();
                });

            await db.queryBuilder('session_data')
                .where("essid", this.UUID)
                .execute().then(async qr => {
                    if (qr.records.length >= 1)
                        await db.queryBuilder('session_data')
                            .where("essid", this.UUID)
                            .delete()
                            .execute();
                });

            await db.disconnect();
        })
    }

    async getID(): Promise<string> {
        return new Promise(async (resolve) => {
            await this.checkUUID();
            resolve(this.UUID);
        });
    }

    private checkIfIdExists(id: string | undefined): Promise<boolean> {
        return DBSession.con.checkIdExists("session", "essid", id);
    }
}

export class DBSessionStorage {
    private static con: Connection;

    constructor(
        private session: DBSession) {

    }

    /**
     * Store the Session Data into DB(JSON as text for example)
     * @param data Data to store into DB
     */
    async store(data: string) {
        this.session.installDB().then(async () => {
            var db = await connect(DBSession.con.connectionobj)

            db.queryBuilder('session_data')
                .replace({ essid: this.session.UUID, data: data })
                .execute();

            db.disconnect();
        })
    }

    async retrieve(): Promise<object> {
        return new Promise(async (resolve) => {
            this.session.installDB().then(async () => {
                var db = await connect(DBSessionStorage.con.connectionobj)

                var result = await db.queryBuilder('session_data')
                    .select('data')
                    .where("essid", this.session.UUID)
                    .execute();

                await db.disconnect();

                resolve(result)
            });
        })
    }
}

export class BasicSessionDataPair<T> {
    Name: string = "";
    Data: T;
    DataType: DataType;

    constructor(Name: string, Data: T, DataType: DataType) {
        this.Name = Name;
        this.Data = Data;
        this.DataType = DataType;
    }

    setData(Data: T) {
        this.Data = Data;
        return this;
    }
}

enum DataType {
    Account
}

export { DBSession as Session };