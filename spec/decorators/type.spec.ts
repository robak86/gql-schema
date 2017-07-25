import {expect} from 'chai';
import {GraphQLField, GraphQLObjectType, GraphQLSchema, GraphQLString, printSchema} from "graphql";

import {ObjectTypeMetadata} from "../../lib/metadata/ObjectTypeMetadata";

import {createUnion} from "../../lib/factories/createUnion";
import * as _ from 'lodash';
import {createEnum} from "../../lib/factories/createEnum";
import {type} from "../../lib/decorators/type";
import {params, field, resolve} from "../../lib/decorators/fields";
import {paramsObject} from "../../lib/index";

describe("@type", () => {
    describe("@type()", () => {
        @type()
        class SomeType {
            @field(GraphQLString)
            someField:string;
        }

        it("attaches metadata object", () => {
            expect(ObjectTypeMetadata.getForClass(SomeType)).to.be.instanceof(ObjectTypeMetadata)
        });

        it("sets default name using class name", () => {
            expect(ObjectTypeMetadata.getForClass(SomeType).toGraphQLType().name).to.eq('SomeType');
        });
    });

    describe("@field()", () => {
        describe("native types", () => {
            const resolveFunction = () => null;

            @type()
            class SomeType {
                @resolve(resolveFunction)
                @field(GraphQLString)
                someField:string;
            }

            describe("resolve", () => {
                it("properly passes resolve function to GraphQLFieldMap", () => {
                    let graphQLObjectType = ObjectTypeMetadata.getOrCreateForClass(SomeType).toGraphQLType();
                    let someFieldField:GraphQLField<any, any> = graphQLObjectType.getFields()['someField'];
                    expect(someFieldField.resolve).to.eq(resolveFunction);
                });
            });

            describe("type", () => {
                it("properly passes native type", () => {
                    let graphQLObjectType = ObjectTypeMetadata.getOrCreateForClass(SomeType).toGraphQLType();
                    let someFieldField:GraphQLField<any, any> = graphQLObjectType.getFields()['someField'];

                    expect(someFieldField.name).to.eq('someField');
                    expect(someFieldField.type).to.eq(GraphQLString);
                });
            });
        });

        describe("annotated type", () => {
            @type()
            class SomeOtherType {
                @field(GraphQLString)
                some:string;
            }

            @type()
            class SomeType {
                @field(SomeOtherType)
                someField:SomeOtherType;
            }

            it("it accepts annotated class as type parameter", () => {
                let graphQLObjectType = ObjectTypeMetadata.getOrCreateForClass(SomeType).toGraphQLType();
                let someFieldField:GraphQLField<any, any> = graphQLObjectType.getFields()['someField'];
                let someFieldGraphQLObjectType:GraphQLObjectType = someFieldField.type as any;

                expect(someFieldGraphQLObjectType).to.eql(ObjectTypeMetadata.getForClass(SomeOtherType).toGraphQLType());
            });
        });

        describe("union type created with createUnion", () => {
            @type()
            class UnionType1 {
                @field(GraphQLString)
                someField:SomeOtherType;
            }

            @type()
            class UnionType2 {
                @field(GraphQLString)
                someField:SomeOtherType;
            }

            type SomeUnion = UnionType1 | UnionType2;
            const SomeUnionType = createUnion('SomeUnionType', [UnionType1, UnionType2], _.noop);

            @type()
            class SomeOtherType {
                @field(SomeUnionType)
                someField:SomeUnion;
            }

            it("uses GraphQLUnionType native type", () => {
                let graphQLObjectType = ObjectTypeMetadata.getOrCreateForClass(SomeOtherType).toGraphQLType();
                let someFieldField:GraphQLField<any, any> = graphQLObjectType.getFields()['someField'];
                expect(someFieldField.type).to.eql(SomeUnionType);
            });
        });

        describe("enum type created with createEnum", () => {
            type Status = 'started' | 'stopped';
            const StatusType = createEnum('Status', ['started', 'stopped']);

            @type()
            class SomeOtherType {
                @field(StatusType)
                status:Status;
            }

            it("uses GraphQLUnionType native type", () => {
                let graphQLObjectType = ObjectTypeMetadata.getOrCreateForClass(SomeOtherType).toGraphQLType();
                let statusField:GraphQLField<any, any> = graphQLObjectType.getFields()['status'];
                expect(statusField.type).to.eql(StatusType);
            });
        });

        describe("arguments", () => {

            @paramsObject()
            class SomeFieldArguments {
                @field(GraphQLString)
                someArgument:string;
            }

            @type()
            class SomeType {
                @field(GraphQLString)
                @params(SomeFieldArguments)
                someField:string;
            }

            it("accepts annotated class for params parameter", () => {
                let graphQLObjectType = ObjectTypeMetadata.getOrCreateForClass(SomeType).toGraphQLType();
                let someFieldArgs = graphQLObjectType.getFields()['someField'].args;
                expect(someFieldArgs[0].type).to.eq(GraphQLString);
                expect(someFieldArgs[0].name).to.eq('someArgument');
            });
        });
    });
});