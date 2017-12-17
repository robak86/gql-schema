import {GraphQLField, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString} from "graphql";
import {expect} from 'chai';
import {description, field, fieldThunk, id, list, listThunk, nonNull, nonNullItems} from '../../lib/';
import {typesResolver} from "../../lib/types-conversion/TypesResolver";
import {TypeMetadata} from "../../lib/types-metadata/TypeMetadata";

function getSpecField(klass, propertyKey:string = 'someField'):GraphQLField<any, any> {
    TypeMetadata.getOrCreateForClass(klass);
    let objectType = typesResolver.toGraphQLType(klass) as GraphQLObjectType;
    return objectType.getFields()[propertyKey];
}

describe("fields decorators", () => {
    let fieldConfig:GraphQLField<any, any>;

    describe("@id()", () => {
        class SomeClass {
            @id() someField:string;
        }

        beforeEach(() => {
            fieldConfig = getSpecField(SomeClass)
        });

        it("sets correct type on GraphQLFieldConfig", () => {
            expect(fieldConfig.type).to.eq(GraphQLID);
        });
    });

    describe("@field()", () => {
        class SomeClass {
            @field(GraphQLString)
            someField:string
        }

        beforeEach(() => {
            fieldConfig = getSpecField(SomeClass)
        });

        it("sets correct type on GraphQLFieldConfig", () => {
            expect(fieldConfig.type).to.eq(GraphQLString);
        });
    });

    describe("@fieldThunk()", () => {
        class SomeClass {
            @fieldThunk(() => GraphQLString)
            someField:string
        }

        beforeEach(() => {
            fieldConfig = getSpecField(SomeClass)
        });

        it("sets correct type on GraphQLFieldConfig", () => {
            expect(fieldConfig.type).to.eq(GraphQLString);
        });
    });

    describe("@list()", () => {
        class SomeClass {
            @list(GraphQLString)
            someField:string
        }

        beforeEach(() => {
            fieldConfig = getSpecField(SomeClass)
        });

        it("sets correct type on GraphQLFieldConfig", () => {
            expect(fieldConfig.type).to.eql(new GraphQLList(GraphQLString));
        });
    });

    describe("@listThunk()", () => {
        class SomeClass {
            @listThunk(() => GraphQLString)
            someField:string
        }

        beforeEach(() => {
            fieldConfig = getSpecField(SomeClass)
        });

        it("sets correct type on GraphQLFieldConfig", () => {
            expect(fieldConfig.type).to.eql(new GraphQLList(GraphQLString));
        });
    });

    describe("decorators chaining", () => {
        describe("chaining decorators for non list type", () => {
            class SomeClass {
                @description('Some Field description')
                @field(GraphQLString) @nonNull()
                someField:string
            }

            beforeEach(() => {
                fieldConfig = getSpecField(SomeClass)
            });

            it("adds type to property config", () => {
                expect(fieldConfig.type).to.eql(new GraphQLNonNull(GraphQLString));
            });

            it("sets description", () => {
                expect(fieldConfig.description).to.eq('Some Field description');
            });
        });

        describe("chaining decorators for list type", () => {
            class SomeClass {
                @description('Some Field description')
                @list(GraphQLString) @nonNull() @nonNullItems()
                someField:string
            }

            beforeEach(() => {
                fieldConfig = getSpecField(SomeClass)
            });

            it("adds type to property config", () => {
                expect(fieldConfig.type).to.eql(new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))));
            });

            it("sets description", () => {
                expect(fieldConfig.description).to.eq('Some Field description');
            });
        });
    });

    describe("throwing errors on forbidden decorators combination", () => {
        it('throws error for @field() and @nonNullItems() combination');
        it('throws error for @field() and @list() used at the same time');
        it('throws error for @field() and @listThunk() used at the same time');
        it('throws error for @fieldThunk() and @list() used at the same time');
    });
});