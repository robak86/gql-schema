import {ConfigData} from "../utils/ConfigData";
import {FieldsMetadata} from "../fields-metadata/FieldsMetadata";
import {invariant} from "../utils/core";
import {IBaseMetadata} from "./IBaseMetadata";


export class BaseTypeMetadata<T extends { name:string }> implements IBaseMetadata<T>{
    config:ConfigData<T> = new ConfigData();

    constructor(protected klass) {
        this.config.set('name', this.klass.name);
    }

    setConfig(config:Partial<T>) {
        this.config.setConfig(config);
    }

    getFieldsMetadata():FieldsMetadata {
        let fieldsMetadata = FieldsMetadata.getForClass(this.klass);
        invariant(!!fieldsMetadata, `Missing fields definition for ${this.klass.constructor.name}, ${this.klass}`);

        return fieldsMetadata;
    }
}