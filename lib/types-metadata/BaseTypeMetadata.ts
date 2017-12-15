import {ConfigData} from "../utils/ConfigData";
import {FieldsMetadata} from "../fields-metadata/FieldsMetadata";
import {invariant} from "../utils/core";

export const GRAPHQL_METADATA_KEY:string = '__GRAPHQL_METADATA';

export class BaseTypeMetadata<T extends { name:string }> {
    protected config:ConfigData<T> = new ConfigData();

    constructor(protected klass) {
        this.config.set('name', this.klass.name);
    }

    setConfig(config:Partial<T>) {
        this.config.setConfig(config);
    }

    protected getFieldsMetadata():FieldsMetadata {
        let fieldsMetadata = FieldsMetadata.getForClass(this.klass);
        invariant(!!fieldsMetadata, `Missing fields definition for ${this.klass.constructor.name}, ${this.klass}`);

        return fieldsMetadata;
    }
}