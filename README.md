# GraphQL Schema Decorators

[![Build Status](https://travis-ci.org/robak86/gql-schema.svg?branch=master)](https://travis-ci.org/robak86/gql-schema)
[![Coverage Status](https://coveralls.io/repos/github/robak86/gql-schema/badge.svg?branch=master)](https://coveralls.io/github/robak86/gql-schema?branch=master)

Yet another experimental library for defining graphql schemas using decorators. Alpha version - use at your own risk.

## Getting started

```bash
npm install gql-schema --save
```

This library requires node.js 4.4.0 or higher, typescript 2.4.x and uses es7 decorators. Make sure your tsconfig.json has ```experimentalDecorators``` set to true ```true``` 

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es6",
        "noImplicitAny": false,
        "sourceMap": false,
        "moduleResolution": "node",
        "experimentalDecorators": true
    }
}
```

## Defining Schema

```typescript
import {type, field, createSchema } from 'gql-schema';
import {GraphQLString, GraphQLSchema, graphql} from "graphql";

@type()
class Query {
    @field(GraphQLString) 
    helloWorld:string
}

@type()
class Mutation {
    @field(GraphQLString) 
    doSomeMutation:string
}

// create schema from annotated classes
const schema:GraphQLSchema = createSchema(Query, Mutation)

async function main() {
    const result = await graphql(schema, `query { helloWorld } `);
    console.log(result.data.helloWorld);
}

main();
```

## ```@type``` decorator
 
```typescript
import {type, field, list, nonNull, nonNullItems, resolve, description, id, argsType, args} from 'gql-schema';
import {GraphQLString, GraphQLInt} from "graphql";

const resolveFunction = (_, args:SomeParams, ctx):Partial<SomeType> => {
    return {} // return SomeData type. For most cases it would be Partial<SomeData> because nested data will be resolved by other resolvers
};

@type({description: 'SomeType description'})
class SomeType {
    @description('id field description')
    @id() @nonNull()
    id:string;

    @field(GraphQLInt)
    someNullableField?:number;

    @field(GraphQLString) @nonNull()
    nonNullableField:string;

    @list(GraphQLString)
    nullableListWithNullItemsAllowed?: string[];

    @list(GraphQLString) @nonNull()
    nonNullableListWithNullItemsAllowed: string[];

    @list(GraphQLString) @nonNull() @nonNullItems()
    nonNullableListWithNullItemsForbidden: string[]
}

@argsType()
class SomeParams {
    @field(GraphQLString) @nonNull()
    someParam:string
}

@type()
class Query {
    @field(SomeType) @nonNull()
    @args(SomeParams) @resolve(resolveFunction)
    someData:SomeType
}
```

Given annotated classes will generate following schema definition

```graphql schema
# SomeType description
type SomeType {
   # id field description
   id: ID!
   someNullableField: Int
   nonNullableField: String! 
   nullableListWithNullItemsAllowed: [String]
   nonNullableListWithNullItemsAllowed: [String]!
   nonNullableListWithNullItemsForbidden: [String!]!
}

type Query {
    someData(someParam: String!):SomeType!
}

```

## ```@input``` decorator

```typescript
import {field, input, nonNull, args, argsType, resolve, type} from 'gql-schema';
import {GraphQLString} from "graphql";

const createUser = (_, args:CreateUserParams, ctx):Partial<User> => {
    return {}
};

@input()
class NewUserParams {
    @field(GraphQLString) @nonNull()
    email:string;

    @field(GraphQLString) @nonNull()
    firstName:string;

    @field(GraphQLString) @nonNull()
    password:string;
}

@input()
class NewUserAddressParams {
    @field(GraphQLString) @nonNull()
    street:string;

    @field(GraphQLString) @nonNull()
    city:string;
}

@argsType()
class CreateUserParams {
    @field(NewUserParams) @nonNull()
    userParams:NewUserParams;

    @field(NewUserAddressParams) @nonNull()
    userAddressParams:NewUserAddressParams;
}


@type()
class Address {
    @field(GraphQLString) @nonNull()
    street:string;

    @field(GraphQLString) @nonNull()
    city:string;
}

@type()
class User {
    @field(GraphQLString) @nonNull()
    email:string;

    @field(GraphQLString) @nonNull()
    firstName:string;

    @field(Address) @nonNull()
    address:Address
}


@type()
class Mutation {
    @field(User) @nonNull()
    @args(CreateUserParams) @resolve(createUser)
    createUser:User
}
```

Given annotated classes will generate following schema definition

```graphql schema
input NewUserParams {
    email:String!
    firstName:String!
    password:String!
}

input NewUserAddressParams{
    street: String!
    city: String!
} 

type User {
    email:String!
    firstName:String!
    address:Address!
}

type Address {
    street: String!
    city: String!
}

type Mutation {
    createUser(userParams: NewUserParams, addressParams: NewUserAddressParams):User!
}
```

## Using typescript enums

```typescript 
import {decorateEnum, type, field, nonNull} from 'gql-schema';

enum JobStatus {
    done = 'ok',
    failed = 'error'
}

decorateEnum('Status', JobStatus); // it makes JobStatus acceptable by @field decorator

@type()
class BackgroundJob {
    @field(JobStatus) @nonNull()
    status:string;
}
```

Given annotated classes will produce following schema definition. 

```graphql schema
type BackgroundJob{
    status: Status!
}

enum Status {
    done
    failed
}
```

```GraphQLEnumType``` for JobStatus will have the same mapping as ts enum

```typescript
[
    {name: 'done', value: 'ok'},
    {name: 'failed', value: 'error'},
]
```

## Defining union types

```typescript 
import {createUnion, field, nonNull, type} from "gql-schema";
import {GraphQLInt} from "graphql";

@type()
class Circle {
    @field(GraphQLInt) @nonNull()
    radius:number;
}

@type()
class Square {
    @field(GraphQLInt) @nonNull()
    length:string;
}

const Shape = createUnion('Shape', [Circle, Square], (obj) => {
    if (_.isNumber(obj.radius)) {
        return Circle
    }

    if (_.isNumber(obj.length)) {
        return Square
    }

    throw new Error(`Unknown shape type`);
});

@type()
class SomeType {
    @field(Shape) @nonNull()
    shape: Circle | Square
}
```

Given code will produce following graphql schema definition 

```graphql schema
type Circle {
    radius: Int!
}

type Square {
    length: Int!
}

union Shape = Circle | Square

type Shape {
    shape:Shape!
}
```

## @interfaceType

```typescript
import {field, id, interfaceType, nonNull, type} from "gql-schema";
import {GraphQLInt, GraphQLString} from "graphql";

@interfaceType({
    resolveType: (asset:Asset) => {
        if (asset.mimeType === 'image/jpg'){
            return Image
        }

        if (asset.mimeType === 'audio/mp3'){
            return AudioAsset
        }

        throw new Error("Unknown asset type")
    }
})
export class Asset {
    @id() @nonNull()
    id:string;

    @field(GraphQLInt) @nonNull()
    size: number;

    @field(GraphQLString) @nonNull()
    mimeType: string;
}

@type({
    interfaces: () => [Asset]
})
export class Image {
    @id() @nonNull()
    id:string;

    @field(GraphQLInt) @nonNull()
    size:number;

    @field(GraphQLString) @nonNull()
    mimeType:string;

    @field(GraphQLInt)
    width:number;

    @field(GraphQLInt)
    height:number;
}

@type({
    interfaces: () => [Asset]
})
export class AudioAsset {
    @id() @nonNull()
    id:string;

    @field(GraphQLInt) @nonNull()
    size:number;

    @field(GraphQLString) @nonNull()
    mimeType:string;

    @field(GraphQLInt)
    length:number;
}
```


Given annotated code will produce following graphql schema

```graphql schema
interface Asset {
     id: ID!
     size: Int!
     mimeType: String!
}
            
type Image implements Asset {
     id: ID!
     size: Int!
     mimeType: String!
     width: Int
     height: Int
}

type AudioAsset implements Asset {
    id: ID!
    size: Int!
    mimeType: String!
    length: Int
}
```  