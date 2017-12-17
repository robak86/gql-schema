import {createEnum, createUnion, decorateEnum, field, input, params, resolve, type} from "../../lib";
import * as _ from "lodash";
import * as fp from 'lodash/fp';
import {GraphQLEnumType, GraphQLEnumValue, GraphQLField, GraphQLInt, GraphQLObjectType, GraphQLString} from "graphql";
import {TypesResolver} from "../../lib/types-conversion/TypesResolver";
import {expect} from "chai";
import {enumsRegistry} from "../../lib/registry/typesRegistry";

describe("Types conversion", () => {
    let typesResolver:TypesResolver;

    describe("converting native types", () => {
        beforeEach(() => {
            typesResolver = new TypesResolver();
        });

        describe("GraphQLString", () => {
            it(`returns GraphQLString`, () => {
                expect(typesResolver.toGraphQLType(GraphQLString)).to.eq(GraphQLString);
            });
        });

        describe("GraphQLInt", () => {
            it(`returns GraphQLInt`, () => {
                expect(typesResolver.toGraphQLType(GraphQLInt)).to.eq(GraphQLInt);
            })
        });
    });

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
                let graphQLObjectType = typesResolver.toGraphQLType(SomeType) as GraphQLObjectType;
                let someFieldField:GraphQLField<any, any> = graphQLObjectType.getFields()['someField'];
                expect(someFieldField.resolve).to.eq(resolveFunction);
            });
        });

        describe("type", () => {
            it("properly passes native type", () => {
                let graphQLObjectType = typesResolver.toGraphQLType(SomeType) as GraphQLObjectType;
                let someFieldField:GraphQLField<any, any> = graphQLObjectType.getFields()['someField'];

                expect(someFieldField.name).to.eq('someField');
                expect(someFieldField.type).to.eq(GraphQLString);
            });
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
            let graphQLObjectType = typesResolver.toGraphQLType(SomeOtherType) as GraphQLObjectType;
            let someFieldField:GraphQLField<any, any> = graphQLObjectType.getFields()['someField'];
            expect(someFieldField.type).to.eql(SomeUnionType);
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
            let graphQLObjectType = typesResolver.toGraphQLType(SomeType) as GraphQLObjectType;
            let someFieldField:GraphQLField<any, any> = graphQLObjectType.getFields()['someField'];
            let someFieldGraphQLObjectType:GraphQLObjectType = someFieldField.type as any;

            expect(someFieldGraphQLObjectType).to.eql(typesResolver.toGraphQLType(SomeOtherType));
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
            let graphQLObjectType = typesResolver.toGraphQLType(SomeOtherType) as GraphQLObjectType;
            let statusField:GraphQLField<any, any> = graphQLObjectType.getFields()['status'];
            expect(statusField.type).to.eql(StatusType);
        });
    });

    describe("params", () => {
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
            let graphQLObjectType = typesResolver.toGraphQLType(SomeType) as GraphQLObjectType;
            let someFieldArgs = graphQLObjectType.getFields()['someField'].args;
            expect(someFieldArgs[0].type).to.eq(GraphQLString);
            expect(someFieldArgs[0].name).to.eq('someArgument');
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
            let graphQLObjectType = typesResolver.toGraphQLType(SomeOtherType) as GraphQLObjectType;
            let statusField:GraphQLField<any, any> = graphQLObjectType.getFields()['status'];
            let type:GraphQLEnumType = statusField.type as any;
            expect(type).to.be.instanceOf(GraphQLEnumType);

            expect(type.getValues().map(fp.pick<GraphQLEnumValue>(['value', 'name']))).to.eql([
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

    describe("converting enum type", () => {
        enum Enum {
            A = 'a',
            B = 'b'
        }

        beforeEach(() => {
            enumsRegistry.registerEnum('Enum', Enum, 'SomeEnumDescription');
        });

        it('returns object returned by toGraphQLInterfaceType on InterfaceMetadata', () => {
            expect(typesResolver.toGraphQLType(Enum)).to.eql(new GraphQLEnumType({
                name: 'Enum',
                description: 'SomeEnumDescription',
                values: {
                    A: {value: 'a'},
                    B: {value: 'b'}
                }
            }));
        });
    });
});