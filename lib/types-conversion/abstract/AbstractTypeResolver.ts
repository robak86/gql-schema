import {ITypeResolver} from "./ITypeResolver";
import * as _ from 'lodash';

export abstract class AbstractTypeResolver<IN, O> {
    constructor(protected typeResolver:ITypeResolver, protected argsTypeResolver:ITypeResolver) {
        this.toGraphQLType = _.memoize(this.toGraphQLType);
    }

    abstract toGraphQLType(target:IN):O
}