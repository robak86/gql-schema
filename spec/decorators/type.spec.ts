import {expect} from 'chai';
import {GraphQLField, GraphQLObjectType, GraphQLSchema, GraphQLString, printSchema} from "graphql";

import {ObjectTypeMetadata} from "../../lib/metadata/ObjectTypeMetadata";

import {createUnion} from "../../lib/factories/createUnion";
import * as _ from 'lodash';
import {createEnum} from "../../lib/factories/createEnum";
import {type} from "../../lib/decorators/type";
import {args} from "../../lib/decorators/args";

describe("@type", () => {
    describe("@type.define()", () => {
        @type.define()
        class SomeType {
        }

        it("attaches metadata object", () => {
            expect(ObjectTypeMetadata.getForClass(SomeType)).to.be.instanceof(ObjectTypeMetadata)
        });

        it("sets default name using class name", () => {
            expect(ObjectTypeMetadata.getForClass(SomeType).toGraphQLType().name).to.eq('SomeType');
        });
    });

    describe("@type.field()", () => {
        describe("native types", () => {
            const resolveFunction = () => null;

            @type.define()
            class SomeType {
                @type.field({type: GraphQLString, resolve: resolveFunction})
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
            @type.define()
            class SomeOtherType {
                @type.field({type: GraphQLString})
                some:string;
            }

            @type.define()
            class SomeType {
                @type.field({type: SomeOtherType})
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
            @type.define()
            class UnionType1 {
                @type.field({type: GraphQLString})
                someField:SomeOtherType;
            }

            @type.define()
            class UnionType2 {
                @type.field({type: GraphQLString})
                someField:SomeOtherType;
            }

            type SomeUnion = UnionType1 | UnionType2;
            const SomeUnionType = createUnion('SomeUnionType', [UnionType1, UnionType2], _.noop);

            @type.define()
            class SomeOtherType {
                @type.field({type: SomeUnionType})
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

            @type.define()
            class SomeOtherType {
                @type.field({type: StatusType})
                status:Status;
            }

            it("uses GraphQLUnionType native type", () => {
                let graphQLObjectType = ObjectTypeMetadata.getOrCreateForClass(SomeOtherType).toGraphQLType();
                let statusField:GraphQLField<any, any> = graphQLObjectType.getFields()['status'];
                expect(statusField.type).to.eql(StatusType);
            });
        });

        describe("arguments", () => {
            class SomeFieldArguments {
                @args.field({type: GraphQLString}) someArgument:string;
            }

            @type.define()
            class SomeType {
                @type.field({type: GraphQLString, args: SomeFieldArguments, nonNull: true})
                someField:string;
            }

            it("accepts annotated class for args parameter", () => {
                let graphQLObjectType = ObjectTypeMetadata.getOrCreateForClass(SomeType).toGraphQLType();
                let someFieldArgs = graphQLObjectType.getFields()['someField'].args;
                expect(someFieldArgs[0].type).to.eq(GraphQLString);
                expect(someFieldArgs[0].name).to.eq('someArgument');


                console.log(printSchema(new GraphQLSchema({
                    query: ObjectTypeMetadata.getOrCreateForClass(SomeType).toGraphQLType()
                })));
            });
        });
    });
});