import { UUID } from "./id/UUID.ts";
import Connection from "./sqllite/Connection.ts";
import BaseField from "./sqllite/BaseField.ts";
import { connect } from "https://deno.land/x/cotton/mod.ts";


class LocalSession {
    private static AllSessionStorages: Record<string, SessionStorage> = {};
    SessionStorage: SessionStorage = new SessionStorage("");
    UUID: string = "NOID";
    private static con = new Connection("/data/db.sqlite");

    constructor(proclaimedSessionID: string | undefined) {
        LocalSession.con.checkTableExists('session').catch(() => {
            LocalSession.con.createTable("session", [new BaseField('ESSID').isPrimary().setType("VARCHAR(128)")])
        }).finally(() => {
            if (!!proclaimedSessionID) {
                if (!!LocalSession.AllSessionStorages[proclaimedSessionID]) {
                    this.SessionStorage = LocalSession.AllSessionStorages[proclaimedSessionID];
                    this.UUID = proclaimedSessionID;
                    //console.log("Loaded existing S")
                } else {
                    // TODO: Create new Session into SQL Database
                    this.SessionStorage = new SessionStorage("");
                    this.UUID = UUID.generate(128);
                    LocalSession.AllSessionStorages[this.UUID] = this.SessionStorage;
                    //console.log("Created S")
                }
            }
        });
    }

    store(name: string, data: string) {

    }
    getID(): string {
        return this.UUID;
    }

    private checkIfIdExists(id: string): boolean {
        return true;
    }
}
export class DBSession {
    private static AllSessionStorages: Record<string, SessionStorage> = {};
    SessionStorage: SessionStorage = new SessionStorage("");
    UUID: string = "NOID";
    private static con = new Connection("/data/db.sqlite");

    constructor(proclaimedSessionID: string|undefined) {
        DBSession.con.checkTableExists('session').catch(() => {
            DBSession.con.createTable("session", [new BaseField('essid').isUnique().setType("VARCHAR(256)")])
        }).finally(() => {

            //console.log("Check ID Exists")
            this.checkIfIdExists(proclaimedSessionID).then(() => {
                //console.log("Found ID in DB!")
                this.UUID = proclaimedSessionID as string;
            }).catch(async(reason) => {
                console.log("Reason: " + reason)

                this.UUID = UUID.generate(256);

                
                var db = await connect(DBSession.con.connectionobj)
                db.execute("INSERT INTO session VALUES(?)", [this.UUID])
                
            })

        });
    }

    store(name: string, data: string) {

    }
    getID(): string {
        return this.UUID;
    }

    private checkIfIdExists(id: string | undefined): Promise<boolean> {
        return DBSession.con.checkIdExists("session", "essid", id);
    }
}

export class SessionStorage {
    Data: Array<BasicSessionDataPair<string>> = [];

    LData: any = {};

    constructor(id: string) {

    }

    getData(name: string) {
        return this.LData[name];
    }

    setData(name: string, value: string) {
        this.LData[name] = value;
    }

    static Load(id: string): SessionStorage {
        // Session Data should be loaded here!
        var retval = new SessionStorage(id);

        // TODO: Load MySQL Data

        // TODO: Load Cached Data

        return retval;
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