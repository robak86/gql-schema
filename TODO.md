* Force every class to have it's class annotation and use the same decorator for every type's fields... 
...but it won't be typesafe :/

but if only difference is just resolve (property) we can add another decorator @resolve()




```typescript

import {input, type, arguments, description} from 'graphql-decorators'

@description('some description')
@input
class SomeInput {
    
    @description(`SomeInput's firstName description`)
    @field({type: GraphQLString})
    firstName: string
    
    
    @description()
    @array({type: GraphQLInt})
    someIds:number[]
}


@type()
class SomeType {
    
    @description() @resolve(someFunction)
    someField:string
}


@arguments()
class SomeArguments {
    
}
```

