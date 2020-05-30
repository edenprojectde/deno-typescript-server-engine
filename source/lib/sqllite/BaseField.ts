import { IField } from "./IField.ts";

export default class Field implements IField {
    name: string = ""
    ai:boolean = false
    pk:boolean = false
    unique:boolean = false
    type:string = "TEXT"

    constructor(name:string) {
        this.name=name;
    }

    isPrimary(){this.pk=true;return this;}
    isUnique(){this.unique=true;return this;}
    isAutoIncrement(){this.ai=true;return this;}
    setType(type:string){this.type=type;return this;}
}