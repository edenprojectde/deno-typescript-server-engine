import { UUID } from "./id/UUID.ts";
import Connection from "./sqllite/Connection.ts";
import BaseField from "./sqllite/BaseField.ts";

export default class Session {
    private static AllSessionStorages: Record<string, SessionStorage> = {};
    SessionStorage: SessionStorage = new SessionStorage("");
    UUID: string="NOID";
    private static con = new Connection("/data/db.sqlite");

    constructor(proclaimedSessionID: string | undefined) {
        Session.con.checkTableExists('session').catch(()=>{
            Session.con.createTable("session", [new BaseField('ESSID').isPrimary().setType("VARCHAR(128)")])
        }).finally(()=>{
            if (!!proclaimedSessionID) {
                if (!!Session.AllSessionStorages[proclaimedSessionID]) {
                    this.SessionStorage = Session.AllSessionStorages[proclaimedSessionID];
                    this.UUID = proclaimedSessionID;
                    //console.log("Loaded existing S")
                } else {
                    // TODO: Create new Session into SQL Database
                    this.SessionStorage = new SessionStorage("");
                    this.UUID = UUID.generate(128);
                    Session.AllSessionStorages[this.UUID]=this.SessionStorage;
                    //console.log("Created S")
                }
            }
        });
    }

    store(name: string, data:string) {

    }
    getID():string{
        return this.UUID;
    }

    private checkIfIdExists(id: string): boolean {
        return true;
    }
}

export class SessionStorage {
    Data: Array<BasicSessionDataPair<string>> = [];

    LData: any={};

    constructor(id: string) {

    }

    getData(name: string) {
        return this.LData[name];
    }

    setData(name: string, value:string) {
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