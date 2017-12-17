export const GRAPHQL_METADATA_KEY:string = '__GRAPHQL_METADATA';

export interface IBaseMetadata<T extends {name: string}> {
    setConfig(config:Partial<T>)
}