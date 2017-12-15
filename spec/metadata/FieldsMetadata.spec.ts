import {expect} from 'chai';
import {GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString} from "graphql";
import {FieldsMetadata} from "../../lib/fields-metadata/FieldsMetadata";
import {field, type} from "../../lib";

describe("FieldsTypeMetadata", () => {

    describe("static getOrCreateForClass", () => {
        let SomeClass;

        beforeEach(() => {
            SomeClass = class {};
        });

        it('assigns new instance of FieldsMetadata', () => {
            FieldsMetadata.getOrCreateForClass(SomeClass);
            expect(FieldsMetadata.getForClass(SomeClass)).to.be.instanceOf(FieldsMetadata);
        });

        it('returns the same instance of FieldsMetadata', () => {
            let firstGet = FieldsMetadata.getOrCreateForClass(SomeClass);
            let secondGet = FieldsMetadata.getOrCreateForClass(SomeClass);
            expect(firstGet).to.eq(secondGet);
        });
    });

    describe(".toGraphQLType", () => {
        let SomeClass,
            someClassFieldsMetadata:FieldsMetadata;

        beforeEach(() => {
            SomeClass = class {};
            someClassFieldsMetadata = FieldsMetadata.getOrCreateForClass(SomeClass);
        });

        describe(".patchConfig", () => {
            it("sets type", () => {
                someClassFieldsMetadata.getField('field').setType(GraphQLString);
                expect(someClassFieldsMetadata.getFields()['field'].toGraphQLFieldConfig().type).to.eql(GraphQLString);
            });

            it("sets thunkType and resolves it", () => {
                someClassFieldsMetadata.getField('field').setTypeThunk(() => GraphQLString);
                expect(someClassFieldsMetadata.getFields()['field'].toGraphQLFieldConfig().type).to.eql(GraphQLString);
            });

            it("wraps type with GraphQLList if list property is set to true", () => {
                someClassFieldsMetadata.getField('field').setListType(GraphQLString);
                expect(someClassFieldsMetadata.getFields()['field'].toGraphQLFieldConfig().type).to.eql(new GraphQLList(GraphQLString));
            });

            it("wraps type with GraphQLNonNull if list property is set to true", () => {
                someClassFieldsMetadata.getField('field').setType(GraphQLString);
                someClassFieldsMetadata.getField('field').setNonNullConstraint();
                expect(someClassFieldsMetadata.getFields()['field'].toGraphQLFieldConfig().type).to.eql(new GraphQLNonNull(GraphQLString));
            });

            it("wraps type with GraphQLNonNull and GraphQLList for nonNull and array properties set to true", () => {
                someClassFieldsMetadata.getField('field').setListType(GraphQLString);
                someClassFieldsMetadata.getField('field').setNonNullConstraint();
                expect(someClassFieldsMetadata.getFields()['field'].toGraphQLFieldConfig().type).to.eql(new GraphQLNonNull(new GraphQLList(GraphQLString)));
            });

            it("wraps type using GraphQLNonNull and GraphQLList for nonNull, array, nonNullItem properties set to true", () => {
                let field = someClassFieldsMetadata.getField('field');
                field.setListType(GraphQLString);
                field.setNonNullConstraint();
                field.setNonNullItemsConstraint();


                expect(someClassFieldsMetadata.getFields()['field'].toGraphQLFieldConfig().type).to
                    .eql(new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))));
            });

            it("only pass valid GraphQLFieldConfigMap properties", () => {
                someClassFieldsMetadata.getField('field').setType(GraphQLString);
                someClassFieldsMetadata.getField('field').setDescription('some description');
                expect(someClassFieldsMetadata.getFields()['field'].toGraphQLFieldConfig().description).to
                    .eql('some description');

                // expect(Object.keys(someClassFieldsMetadata.getFields()['field']).sort()).to.eql([
                //     "args",
                //     "deprecationReason",
                //     "description",
                //     "resolve",
                //     "type"
                // ])
            });

            it("creates GraphQLType for annotated class passed as type", () => {
                @type()
                class SomeClass {
                    @field(GraphQLString) someField:string;
                }

                (SomeClass as any).kurwa = "WTF";

                someClassFieldsMetadata.getField('field').setType(SomeClass);
                expect(someClassFieldsMetadata.getFields()['field'].toGraphQLFieldConfig().type).to.be.instanceOf(GraphQLObjectType)
            });
        });
    });

});