export type ResolverFn<PARAMS, PARENT, RESULT> = (params:PARAMS, parent:PARENT) => RESULT


export type ResolversRegistry = {
    [attrName:string]:ResolverFn<any, any, any>
}

export class ResolversDefinition<A extends AttributesDefinitionData, D extends ResolversRegistry> {

    static define<T extends AttributesDefinitions<any>>(attributes:T):ResolversDefinition<GetDefinitions<T>, {}> {
        return new ResolversDefinition<GetDefinitions<T>, {}>();
    }

    // private constructor() {}

    getA():A {
        throw new Error("Implement me");
    }

    attribute<K extends keyof A>(key:K, resolver:ResolverFn<any, NativeAttributesFromAttributesDefinitionData<A>, GraphToNativeType<A[K]['type']>>):ResolversDefinition<A, D & Record<K, { type:typeof resolver }>> {
        throw new Error("implement me");
    }
}


const UserAttrs = AttributesDefinitions.define()
// .attribute('firstName', {type: ResolverFn, params: SomeInputType, default: 0})
    .attribute('firstName', ScalarType.String)
    .attribute('lastName', ScalarType.String)
    .attribute('isAdult', ScalarType.Boolean);


const UserResolvers = ResolversDefinition.define(UserAttrs)
    .attribute('firstName', () => true)
    .attribute('lastName', () => 'aaa');


const A:{firstName: {type: ScalarType.String}} = UserResolvers.getA();


// const UserResolvers = new ResolversDefinition<,{}>()
//     .attribute('firstName', () => 'aaa')
//     .attribute('lastName', () => 'aaa');