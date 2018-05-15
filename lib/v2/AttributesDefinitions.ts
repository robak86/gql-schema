enum ScalarType {
    Int = 'Int',
    Float = 'Float',
    String = 'String',
    Boolean = 'Boolean',
    ID = 'ID'
}


type AttributeType = ScalarType | Attributes<any>;

type NarrowAttributeType<T> =
    T extends ScalarType ? T :
        T extends Attributes<infer AA> ? AA : never;

type TsType<T> =
    T extends ScalarType.Int ? number :
        T extends ScalarType.Float ? number :
            T extends ScalarType.Boolean ? boolean :
                T extends ScalarType.ID ? string :
                    T extends ScalarType.String ? string :
                        T extends Attributes<infer A> ? AttributesRegistryTsType<A> : never;

type AttributeDefinition<T extends AttributeType> = {
    type:T
}

type ExtractAttributesRegistry<T extends Attributes<any>> = T extends Attributes<infer D> ? D :never;

type GetType<T extends AttributeDefinition<any>> = T extends AttributeDefinition<infer A> ? A :never;


type AttributesRegistry = {
    [attrName:string]:AttributeDefinition<any>
}

class Attributes<D extends AttributesRegistry> {
    static define():Attributes<{}> {
        return new Attributes<{}>();
    }

    private constructor() {}

    //TODO: find better name? merge ? include ?
    inherit() {

    }

    attribute<K extends string, T extends AttributeType>(key:K, type:T):Attributes<D & Record<K, { type:T }>> {
        throw new Error("implement me");
    }
}


type AttributesTsType<T extends Attributes<AttributesRegistry>> = {
    [K in keyof ExtractAttributesRegistry<T>]:TsType<ExtractAttributesRegistry<T>[K]['type']>
}

type AttributesRegistryTsType<T extends AttributesRegistry> = {
    [K in keyof T]:TsType<T[K]['type']>
}


const UserAttrs = Attributes.define()
    .attribute('firstName', ScalarType.String)
    .attribute('lastName', ScalarType.String)
    .attribute('isAdult', ScalarType.Boolean);


type UserAttrs = AttributesTsType<typeof UserAttrs>;


const user:UserAttrs = {
    firstName: 'asdf',
    isAdult: false,
    lastName: 'asdf'
};


//
//
//
// enum Constraint {
//     NotNull = 'notNull',
//     List = 'list', //TODO: it should not be included here ?
//     NotNullItem = 'notNullItem'
// }
//
// type C1 = Constraint.NotNull;
// type C2 = Constraint.List;
// type C3 = Constraint.List | Constraint.NotNull
// type C4 = Constraint.List | Constraint.NotNull | Constraint.NotNullItem
//
//
// type MapToNative<T, C> =
//     C extends C1 ? T :
//         C extends C2 ? (T | null)[] | undefined :
//             C extends C3 ? (T | null)[] :
//                 C extends C4  ? T[] : never;
//
//
// type ArrayValuesTypes<T> = T extends any[] ? T[number] : never;
//
// const cSet1 = [Constraint.NotNull, Constraint.List]
//
//
// const notNullString:MapToNative<string, ArrayValuesTypes<typeof cSet1>> = 'asd';
// const notNullString3:MapToNative<string, C3> = 'asd';
//
//
// const stringList:MapToNative<string, C2> = ['sd', null];
//
// // const stringList:MapToNative<string, C4> = ['sd', null];
//
//
// function takeEnum<T>(enumObj:T) {
//
// }
//
// takeEnum(Constraint)
//
// enum Type {
//     String = 'string',
//     Boolean = 'boolean'
// }
//
// // enum Constraint {
// //     NotNull = 'notNull',
// //     Nullable = 'nullable'
// // }
//
// type ConstrainedType<T, C extends boolean> = {
//     type:T
//     nullable:C
// }
//
// type NativeType<T> =
//     T extends Type.String ? string :
//         T extends Type.Boolean ? boolean :
//             never;
//
// type MaterializedType<CT> =
//     CT extends ConstrainedType<infer T, false> ? NativeType<T> :
//         CT extends ConstrainedType<infer T, true> ? (NativeType<T> | undefined) : never;
//
// type Registry = {
//     [key:string]:ConstrainedType<Type, boolean>
// }
//
//
// type NativeObjType<T extends Registry> = {
//     [K in keyof T]:MaterializedType<T[K]>
// }
//
//
// function create<T extends Registry>(reg:T):T {
//     return reg;
// }
//
//
// var obj = create({firstName: {type: Type.String, nullable: false}})
//
// const ooo:NativeObjType<typeof obj> = {firstName: 1233}
//
//
// class Builder<R extends Registry= {}> {
//
//     attribute2<K extends string, T extends Type, C extends Constraint>(key:K, type:T, constraint:C):Builder<R & Record<K, { type:T, constraint:C }>> {
//         return this as any;
//     }
//
//     // attribute2<K extends string, T extends Type, C extends Constraint>(key:K, type:T, constraint:C):Builder<R & Record<K, {type: T, constraint: C}>>{
//     //     return this as any;
//     // }
//
//
//     enumAttribute<T>(fieldName, nativeEnumObj:T) {}
//
//     get type():R {
//         return null as any;
//     }
// }
//
// const attributesSchema = new Builder<{}>()
//     .attribute2('firstName', Type.String, Constraint.NotNull)
//     .attribute2('lastName', Type.String, Constraint.Nullable)
//
//
// const resolvers = {}
//
// function type(...args:any[]) {}
//
// const someType = type(attributesSchema, resolvers)
//
//
// type ExtractBuilderType<T extends Builder<any>> = T extends Builder<infer A> ? NativeObjType<A> : never;
//
//
// const ooodd:ExtractBuilderType<typeof attributesSchema> = {firstName: undefined, lastName: 'sdf'}
//
//
// interface Schema {
//     input()
//     type(def:Typedefinition) //
//     registerEnum(name:string, nativeEnumObj:any) //The only place where we use name
//     interface()
// }
//

/**
 function customConstraint(val):boolean {

    }
 //!!!! attributes are the only definition which is required to map this into native object!!!!
 const userAttributes = type
 .attribute('firstName', Type.String, [Constraint.NotNull, customConstraint ] )
 .attribute('lastName', Type.String, [Constraint.NotNull, customConstraint ] )
 .attribute('address', AddressType, [Constraint.NotNull, customConstraint ] )

 resolvers
 .resolve('address', (parent:NativeType<UserType>) => null)


 const userType = type('User', userAttributes, resolvers) //

 type<A, R>(typeName:string, attrs:A, resolvers:R) //each resolver would know it's parent object and the precise type it needs to return!!! :D

 */