import {expect} from 'chai';
import {GraphQLField, GraphQLObjectType, GraphQLSchema, GraphQLString, printSchema} from "graphql";
import {type} from "../lib/decorators/ObjectType";
import {ObjectTypeMetadata} from "../lib/metadata/ObjectTypeMetadata";
import {inferGraphQLType} from "../lib/utils";
import {argumentField} from "../lib/decorators/argumentField";

describe("ObjectTypeMetadata", () => {
    describe("@type.define", () => {

        it("gets name from class name", () => {
            @type.define()
            class SomeType {
            }

            expect(ObjectTypeMetadata.getOrCreateForClass(SomeType).toGraphQLType().name).to.eq('SomeType');
        });
    });

    describe("@type.field", () => {
        describe("type", () => {
            it("accepts graphql native types", () => {
                const resolveFunction = () => null;

                @type.define()
                class SomeType {
                    @type.field({type: GraphQLString, resolve: resolveFunction})
                    someField:string;
                }

                let graphQLObjectType = ObjectTypeMetadata.getOrCreateForClass(SomeType).toGraphQLType();
                let someFieldField:GraphQLField<any, any> = graphQLObjectType.getFields()['someField'];

                expect(someFieldField.name).to.eq('someField');
                expect(someFieldField.type).to.eq(GraphQLString);
                expect(someFieldField.resolve).to.eq(resolveFunction);
            });

            it("it accepts annotated class", () => {
                @type.define()
                class SomeOtherType {
                }

                @type.define()
                class SomeType {
                    @type.field({type: SomeOtherType})
                    someField:SomeOtherType;
                }

                let graphQLObjectType = ObjectTypeMetadata.getOrCreateForClass(SomeType).toGraphQLType();
                let someFieldField:GraphQLField<any, any> = graphQLObjectType.getFields()['someField'];
                let someFieldGraphQLObjectType:GraphQLObjectType = someFieldField.type as any;
                expect(someFieldGraphQLObjectType).to.eql(inferGraphQLType(SomeOtherType, [ObjectTypeMetadata]));
                expect(someFieldGraphQLObjectType.name).to.eq('SomeOtherType');
            });

            it("accepts annotated class for args parameter", () => {
                class SomeFieldArguments {
                    @argumentField({type: GraphQLString}) someArgument:string;
                }

                @type.define()
                class SomeType {
                    @type.field({type: GraphQLString, args: SomeFieldArguments, nonNull: true})
                    someField:string;
                }

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