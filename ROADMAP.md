# ROADMAP

### Add support for inheritance
- investigate possible pitfalls 

```typescript
class PersistedObject {    
    @id()
    id:string
    
    @field(CustomGraphQLDateScalar)
    createdAt:Date
    
    @field(CustomGraphQLDateScalar)
    updatedAt:Date
}

@type()
class User extends PersistedObject {}
```

should generate:

```graphql
type User {
    id: ID
    createdAt: CustomGraphQLDateScalar
    updateAt: CustomGraphQLDateScalar
}
```

### Infer basic types from ts metadata
- investigate if it makes sense, because this feature would be very limited - only for couple of types.

### Improve error handling and error messages
- add assertions for all setters in fields metadata
- add validation of field configuration
- add more descriptive logs for all errors thrown from Metadata classes during native object creation
- assert one metadata object is attached to class

### Refactoring
- use one convention for private fields
- currently all metadata classes knows how to build graphql types - investigate if extracting this into separate "strategy like" classes makes sens
- getOrCreateForClass and getForClass can be merged to one method
```typescript
class SomeMetadata {
    static getForClass(attachIfMissing:boolean = false){}
}
```