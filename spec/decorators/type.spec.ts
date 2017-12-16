import {expect} from 'chai';
import {GraphQLEnumType, GraphQLField, GraphQLObjectType, GraphQLString} from "graphql";
import * as _ from 'lodash/fp';
import {createEnum, decorateEnum, field, input, params, resolve, type} from "../../lib";
import {TypeMetadata} from "../../lib/types-metadata/TypeMetadata";

describe("@type", () => {
    describe("@type()", () => {
        @type()
        class SomeType {
            @field(GraphQLString)
            someField:string;
        }

        it("attaches metadata object", () => {
            expect(TypeMetadata.getForClass(SomeType)).to.be.instanceof(TypeMetadata)
        });

        it("sets default name using class name", () => {
            expect(TypeMetadata.getForClass(SomeType).toGraphQLObjectType().name).to.eq('SomeType');
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
                    let graphQLObjectType = TypeMetadata.getOrCreateForClass(SomeType).toGraphQLObjectType();
                    let someFieldField:GraphQLField<any, any> = graphQLObjectType.getFields()['someField'];
                    expect(someFieldField.resolve).to.eq(resolveFunction);
                });
            });

            describe("type", () => {
                it("properly passes native type", () => {
                    let graphQLObjectType = TypeMetadata.getOrCreateForClass(SomeType).toGraphQLObjectType();
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
                let graphQLObjectType = TypeMetadata.getOrCreateForClass(SomeType).toGraphQLObjectType();
                let someFieldField:GraphQLField<any, any> = graphQLObjectType.getFields()['someField'];
                let someFieldGraphQLObjectType:GraphQLObjectType = someFieldField.type as any;

                expect(someFieldGraphQLObjectType).to.eql(TypeMetadata.getForClass(SomeOtherType).toGraphQLObjectType());
            });
        });

        describe("union type created with createUnion", () => {
            // @type()
            // class UnionType1 {
            //     @field(GraphQLString)
            //     someField:SomeOtherType;
            // }
            //
            // @type()
            // class UnionType2 {
            //     @field(GraphQLString)
            //     someField:SomeOtherType;
            // }
            //
            // type SomeUnion = UnionType1 | UnionType2;
            // // FieldsMetadata.getOrCreateForClass(UnionType1);
            // // let wtf = FieldsMetadata.getForClass(UnionType1);
            //
            // const SomeUnionType = createUnion('SomeUnionType', [UnionType1, UnionType2], _.noop);
            //
            // @type()
            // class SomeOtherType {
            //     @field(SomeUnionType)
            //     someField:SomeUnion;
            // }
            //
            // it("uses GraphQLUnionType native type", () => {
            //     let graphQLObjectType = TypeMetadata.getOrCreateForClass(SomeOtherType).toGraphQLObjectType();
            //     let someFieldField:GraphQLField<any, any> = graphQLObjectType.getFields()['someField'];
            //     expect(someFieldField.type).to.eql(SomeUnionType);
            // });
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
                let graphQLObjectType = TypeMetadata.getOrCreateForClass(SomeOtherType).toGraphQLObjectType();
                let statusField:GraphQLField<any, any> = graphQLObjectType.getFields()['status'];
                expect(statusField.type).to.eql(StatusType);
            });
        });

        describe("ts enum decorated with decorateEnum function", () => {
            enum Status {
                started = 'started',
                stopped = 'stopped'
            }

            decorateEnum('Status', Status);

            @type()
            class SomeOtherType {
                @field(Status)
                status:Status;
            }

            it("uses GraphQLEnumType native type", () => {
                let graphQLObjectType = TypeMetadata.getOrCreateForClass(SomeOtherType).toGraphQLObjectType();
                let statusField:GraphQLField<any, any> = graphQLObjectType.getFields()['status'];
                let type:GraphQLEnumType = statusField.type as any;
                expect(type).to.be.instanceOf(GraphQLEnumType);
                expect(type.getValues().map(_.pick(['value', 'name']))).to.eql([
                    {
                        name: "started",
                        value: "started"
                    },
                    {
                        name: "stopped",
                        value: "stopped"
                    }
                ])
            });
        });

        describe("arguments", () => {

            @input()
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
                let graphQLObjectType = TypeMetadata.getOrCreateForClass(SomeType).toGraphQLObjectType();
                let someFieldArgs = graphQLObjectType.getFields()['someField'].args;
                expect(someFieldArgs[0].type).to.eq(GraphQLString);
                expect(someFieldArgs[0].name).to.eq('someArgument');
            });
        });
    });
});