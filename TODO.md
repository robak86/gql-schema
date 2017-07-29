* infer basic types from ts metadata
* add decorators/factories for defining scalars 
* consider setting NotNull for true as default for all @fields
* consider setting NotNull and NotNullItem for true  for all  @arrays
* GRAPHQL_METADATA_KEY cannot be shared by all metadata objects 
* assert one metadata object is attached to class
* getOrCreateForClass and getForClass can be merged to one method 
```typescript
class SomeMetadata {
    static getForClass(attachIfDoesntExists:boolean = false){
        
    }
}
```