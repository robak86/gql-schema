import {Type} from "../utils/types";

export function metadataGet<T>(metadataKey:string): (klass) => T {
    return (klass) => Reflect.getMetadata(metadataKey, klass);
}

export function metadataGetOrSet<T>(metadataKey:string, MetadataClass:Type<T>): (klass) => T {
    return (klass) => {
        let nodeMetadata = Reflect.getOwnMetadata(metadataKey, klass);

        if (!nodeMetadata) {
            nodeMetadata = new MetadataClass(klass);
            Reflect.defineMetadata(metadataKey, nodeMetadata, klass);
        }

        return nodeMetadata;
    }
}