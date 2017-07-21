# graphql-decorators

Experimental(pre alpha) library for defining graphql schemas using decorators

## Getting started

This tool requires node.js 4.4.0 or later and uses es7 decorators. Make sure your tsconfig.json has ```experimentalDecorators``` set to true ```true``` 

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


## Decorators for ```GraphQLObjectType```  
 
```typescript
import {type, field, list, nonNull, nonNullItems, resolve, description, id, paramsObject, params} from 'graphql-decorators';
import {GraphQLString, GraphQLInt} from "graphql";

const resolveFunction = (_, args:SomeParams, ctx):SomeType => {
    // return SomeData type. For most cases it would be Partial<SomeData> because nested data will be resolved by other resolvers
}

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

## Decorators for ```GraphQLInputObjectType```
TODO