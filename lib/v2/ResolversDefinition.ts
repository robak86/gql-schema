export type ResolverFn<PARAMS, PARENT, RESULT> = (params:PARAMS, parent:PARENT) => RESULT


export type ResolversRegistry = {
    [attrName:string]:ResolverFn<any, any, any>
}

export class ResolversDefinition<A extends AttributesRegistry, D extends ResolversRegistry> {

    static define<T extends Attributes<any>>(attributes:T):ResolversDefinition<ExtractAttributesRegistry<T>, {}> {
        return new ResolversDefinition<ExtractAttributesRegistry<T>, {}>();
    }

    // private constructor() {}

    getA():A {
        throw new Error("Implement me");
    }

    attribute<K extends keyof A>(key:K, resolver:ResolverFn<any, AttributesRegistryTsType<A>, TsType<A[K]['type']>>):ResolversDefinition<A, D & Record<K, { type:typeof resolver }>> {
        throw new Error("implement me");
    }
}


const UserAddress = Attributes.define()
// .attribute('firstName', {type: ResolverFn, params: SomeInputType, default: 0})
    .attribute('street', ScalarType.String)
    .attribute('postalCode', ScalarType.Int);

const UserAttrs = Attributes.define()
// .attribute('firstName', {type: ResolverFn, params: SomeInputType, default: 0})
    .attribute('firstName', ScalarType.String)
    .attribute('lastName', ScalarType.String)
    .attribute('isAdult', ScalarType.Boolean)
    .attribute('address', UserAddress);


type UserAttrs = AttributesTsType<typeof UserAttrs>;

const user:UserAttrs = {
    firstName: 'asdf',
    isAdult: false,
    lastName: 'asdf',
    address: {
        street: "asd",
        // postalCode: 23
        postalCode: 123
    }
};


const UserResolvers = ResolversDefinition.define(UserAttrs)
    .attribute('firstName', () => 123)
    .attribute('lastName', () => 'aaa')
    .attribute('address', () => 'aaa')
// ;
//
//
// const A:{firstName: {type: ScalarType.String}} = UserResolvers.getA();


// const UserResolvers = new ResolversDefinition<,{}>()
//     .attribute('firstName', () => 'aaa')
//     .attribute('lastName', () => 'aaa');