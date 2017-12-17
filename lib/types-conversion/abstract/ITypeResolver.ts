export interface ITypeResolver<IN = any, O = any> {
    toGraphQLType(target:IN):O
}