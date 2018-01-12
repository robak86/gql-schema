# ROADMAP

### Reorganize, rewrite specs

### Infer basic types from ts metadata
- investigate if it makes sense, because this feature would be very limited - only for couple of types.

### Improve error handling and error messages
- add assertions for all setters in fields metadata
- add validation of field configuration
- add more descriptive logs for all errors thrown from Metadata classes during native object creation
- assert one metadata object is attached to class
- print warnings if some @decarotors are skipped (for example @defaultValue for types other than input)

### Refactoring
- use one convention for private fields
- currently all metadata classes knows how to build graphql types - investigate if extracting this into separate "strategy like" classes makes sens
- getOrCreateForClass and getForClass can be merged to one method
```typescript
class SomeMetadata {
    static getForClass(attachIfMissing:boolean = false){}
}
```