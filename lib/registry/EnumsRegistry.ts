import {GraphQLEnumType} from "graphql";
import {mapEnumToEnumTypeValues} from "../utils/enums";


export class EnumsRegistry {
    private enums:Map<any, GraphQLEnumType> = new Map();

    registerEnum(name:string, enumType, description?) {
        if (this.enums.has(enumType)) {
            throw new Error(`Given enum type is already registered with ${this.enums.get(enumType).name}`);
        }

        this.enums.set(enumType, new GraphQLEnumType({
            name,
            description,
            values: mapEnumToEnumTypeValues(enumType)
        }))
    }

    getGraphQLEnumType(enumType:Object):GraphQLEnumType {
        return this.enums.get(enumType);
    }

    describeField<T>(enumType:T, field:keyof T, description:string) {
        if (!this.enums.has(enumType)) {
            throw new Error('Given enum type is not registered')
        }

        this.enums.get(enumType).getValue(field).description = description;
    }

    hasEnum(enumType:Object):boolean {
        return this.enums.has(enumType);
    }
}