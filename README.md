# graphql-decorators

[![Build Status](https://travis-ci.org/robak86/graphql-decorators.svg?branch=master)](https://travis-ci.org/robak86/graphql-decorators)

[![Coverage Status](https://coveralls.io/repos/github/robak86/graphql-decorators/badge.svg?branch=master)](https://coveralls.io/github/robak86/graphql-decorators?branch=master)

Yet another experimental library for defining graphql schemas using decorators. Not already published - alpha status. 

## Getting started

This library requires node.js 4.4.0 or later and uses es7 decorators. Make sure your tsconfig.json has ```experimentalDecorators``` set to true ```true``` 

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es6",
        "noImplicitAny": false,
        "sourceMap": false,
        "moduleResolution": "node",
        "experimentalDecorators": true,
    },
    "exclude": [
        "node_modules"
    ]
}
```


## Defining Schema

```typescript
import {type, field, createSchema } from 'graphql-decorators';
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
import {type, field, list, nonNull, nonNullItems, resolve, description, id, paramsObject, params} from 'graphql-decorators';
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

@paramsObject()
class SomeParams {
    @field(GraphQLString) @nonNull()
    someParam:string
}

@type()
class Query {
    @field(SomeType) @nonNull()
    @params(SomeParams) @resolve(resolveFunction)
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
import {field, input, nonNull, params, paramsObject, resolve, type} from 'graphql-decorators';
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

@paramsObject()
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
    @params(CreateUserParams) @resolve(createUser)
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