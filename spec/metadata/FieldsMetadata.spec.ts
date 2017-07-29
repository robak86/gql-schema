import {noop} from "../../lib/utils/core";
import {expect} from 'chai';
import {GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString} from "graphql";
import {FieldsMetadata} from "../../lib/metadata/FieldsMetadata";
import {type} from "../../lib/decorators/type";
import {field} from "../../lib/decorators/fields";

describe("FieldsTypeMetadata", () => {
    describe("static getForClass", noop);
    describe("static getOrCreateForClass", noop);

    describe(".toGraphQLType", () => {
        let SomeClass,
            someClassFieldsMetadata:FieldsMetadata;

        beforeEach(() => {
            SomeClass = class {};
            someClassFieldsMetadata = FieldsMetadata.getOrCreateForClass(SomeClass);
        });


        describe(".patchConfig", () => {
            it("sets type", () => {
                someClassFieldsMetadata.patchConfig('field', {type: GraphQLString});
                expect(someClassFieldsMetadata.getFields()['field'].type).to.eql(GraphQLString);
            });

            it("sets thunkType and resolves it", () => {
                someClassFieldsMetadata.patchConfig('field', {thunkType: () => GraphQLString});
                expect(someClassFieldsMetadata.getFields()['field'].type).to.eql(GraphQLString);
            });

            it("wraps type with GraphQLList if list property is set to true", () => {
                someClassFieldsMetadata.patchConfig('field', {type: GraphQLString, array: true});
                expect(someClassFieldsMetadata.getFields()['field'].type).to.eql(new GraphQLList(GraphQLString));
            });

            it("wraps type with GraphQLNonNull if list property is set to true", () => {
                someClassFieldsMetadata.patchConfig('field', {type: GraphQLString, nonNull: true});
                expect(someClassFieldsMetadata.getFields()['field'].type).to.eql(new GraphQLNonNull(GraphQLString));
            });

            it("wraps type with GraphQLNonNull and GraphQLList for nonNull and array properties set to true", () => {
                someClassFieldsMetadata.patchConfig('field', {type: GraphQLString, nonNull: true, array: true});
                expect(someClassFieldsMetadata.getFields()['field'].type).to.eql(new GraphQLNonNull(new GraphQLList(GraphQLString)));
            });

            it("wraps type using GraphQLNonNull and GraphQLList for nonNull, array, nonNullItem properties set to true", () => {
                someClassFieldsMetadata.patchConfig('field', {
                    type: GraphQLString,
                    nonNull: true,
                    array: true,
                    nonNullItem: true
                });
                expect(someClassFieldsMetadata.getFields()['field'].type).to
                    .eql(new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))));
            });

            it("only pass valid GraphQLFieldConfigMap properties", () => {
                someClassFieldsMetadata.patchConfig('field', {type: GraphQLString});
                expect(Object.keys(someClassFieldsMetadata.getFields()['field']).sort()).to.eql([
                    "args",
                    "deprecationReason",
                    "description",
                    "resolve",
                    "type"
                ])
            });

            it("creates GraphQLType for annotated class passed as type", () => {
                @type()
                class SomeClass {
                    @field(GraphQLString) someField:string;
                }

                someClassFieldsMetadata.patchConfig('field', {type: SomeClass});
                expect(someClassFieldsMetadata.getFields()['field'].type).to.be.instanceOf(GraphQLObjectType)
            });
        });
    });

});