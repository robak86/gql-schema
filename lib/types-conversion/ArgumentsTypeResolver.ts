import {invariant} from "../utils/core";
import * as _ from "lodash";
import {ITypeResolver} from "./abstract/ITypeResolver";
import {ParamsMetadata} from "../types-metadata/ParamsMetadata";
import {ArgumentMapResolver} from "./input/ArgumentMapResolver";

export class ArgumentsTypeResolver implements ITypeResolver {
    private argumentsMapBuilder:ArgumentMapResolver;

    constructor(protected typesResolver:ITypeResolver) {
        this.argumentsMapBuilder = new ArgumentMapResolver(this.typesResolver, this);
    }

    toGraphQLType(type):any {
        if (_.isFunction(type)) {
            let metadata:any = ParamsMetadata.getForClass(type);
            invariant(!!metadata, `Missing ParamsMetadata for ${type}. Decorate class using @params decorator`);

            return this.argumentsMapBuilder.toGraphQLType(metadata);
        }

        throw new Error(`Cannot infer type for ${JSON.stringify(type)}`)
    }
}