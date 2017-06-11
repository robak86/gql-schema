function field(...args:any[]):any {}
function nonNull(...args:any[]):any {}


class SomeClass{
    @nonNull()
    @field()
    someProperty:string;
}