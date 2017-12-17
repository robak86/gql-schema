import {TypeMetadata} from "../types-metadata/TypeMetadata";
import {InterfaceTypeMetadata} from "../types-metadata/InterfaceTypeMetadata";
import {enumsRegistry} from "../registry/typesRegistry";
import {invariant} from "../utils/core";
import {GraphQLType, isType} from "graphql";
import * as _ from "lodash";
import {getMetadata} from "../utils/metadata";
import {ParamsMetadata} from "../types-metadata/ParamsMetadata";
import {ITypeResolver} from "./abstract/ITypeResolver";
import {ArgumentsTypeResolver} from "./ArgumentsTypeResolver";
import {ObjectTypeResolver} from "./output/ObjectTypeResolver";
import {InterfaceTypeResolver} from "./output/InterfaceTypeResolver";
import {InputObjectTypeResolver} from "./input/InputObjectTypeResolver";
import {ArgsType, FieldType} from "../fields-metadata/FieldConfig";

export type TypeResolversParams = {
    inputObjectTypeResolver:ITypeResolver,
    objectTypeResolver:ITypeResolver,
    interfaceTypeResolver:ITypeResolver,
    argumentTypeResolver:ITypeResolver
}

export class TypesResolver implements ITypeResolver {
    private argumentTypeResolver:ArgumentsTypeResolver;
    private inputObjectTypeResolver:InputObjectTypeResolver;
    private objectTypeResolver:ObjectTypeResolver;
    private interfaceTypeResolver:InterfaceTypeResolver;

    constructor(builders:Partial<TypeResolversParams> = {}) {
        this.argumentTypeResolver = builders.argumentTypeResolver || new ArgumentsTypeResolver(this)  as any;
        this.inputObjectTypeResolver = builders.inputObjectTypeResolver || new InputObjectTypeResolver(this, this.argumentTypeResolver) as any;
        this.objectTypeResolver = builders.objectTypeResolver || new ObjectTypeResolver(this, this.argumentTypeResolver) as any;
        this.interfaceTypeResolver = builders.interfaceTypeResolver || new InterfaceTypeResolver(this, this.argumentTypeResolver) as any;
    }

    toGraphQLType(type:FieldType | ArgsType):GraphQLType {
        if (isType(type)) {
            return type;
        }

        if (enumsRegistry.hasEnum(type)) {
            return enumsRegistry.getGraphQLEnumType(type);
        }

        if (_.isFunction(type)) {
            let metadata = getMetadata(type as any);
            invariant(!!metadata, `Missing TypeMetadata for ${type}. Decorate class using @type decorator.`);

            if (metadata instanceof ParamsMetadata) {
                return this.inputObjectTypeResolver.toGraphQLType(metadata);
            }

            if (metadata instanceof TypeMetadata) {
                return this.objectTypeResolver.toGraphQLType(metadata);
            }

            if (metadata instanceof InterfaceTypeMetadata) {
                return this.interfaceTypeResolver.toGraphQLType(metadata);
            }

            throw new Error(`Unknown metadata found ${metadata}`)
        }

        throw new Error(`Cannot infer type for ${JSON.stringify(type)}`)
    }
}

export const typesResolver = new TypesResolver();

