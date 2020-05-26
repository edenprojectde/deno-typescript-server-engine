import { UUID } from "./id/UUID.ts";

export default class Session {
    SessionStorage: SessionStorage;

    constructor(proclaimedSessionID: string | undefined) {
        if(!!proclaimedSessionID) 
            if(this.checkIfIdExists(proclaimedSessionID)) 
                this.SessionStorage = new SessionStorage(proclaimedSessionID);
                
        throw new Error("SessionID doesn ot exist.")
    }

    private checkIfIdExists(id: string):boolean {
        return true;
    }
}

export class SessionStorage {
    Data: Array<BasicSeasonDataPair<string>> = [];

    constructor(id: string) {

    }

    getData(Name: string){
        
    }

    static Load(id: string) : SessionStorage {
        // Session Data should be loaded here!
        var retval = new SessionStorage(id);

        // TODO: Load MySQL Data

        // TODO: Load Cached Data

        return retval;
    }
}

export class BasicSeasonDataPair<T> {
    Name: string="";
    Data: T;
    DataType: DataType;

    constructor(Name: string, Data: T, DataType: DataType) {
        this.Name = Name;
        this.Data = Data;
        this.DataType = DataType;
    }

    setData(Data: T){
        this.Data=Data;
        return this;
    }
}

enum DataType {
    Account
}