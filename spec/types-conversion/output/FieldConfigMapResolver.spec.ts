import {expect} from 'chai';
import {GraphQLField, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString} from "graphql";
import {FieldsMetadata} from "../../../lib/fields-metadata/FieldsMetadata";
import {field} from "../../../lib";
import {typesResolver} from "../../../lib/types-conversion/TypesResolver";
import {TypeMetadata} from "../../../lib/types-metadata/TypeMetadata";

function getSpecField(klass, propertyKey:string = 'someField'):GraphQLField<any, any> {
    TypeMetadata.getOrCreateForClass(klass);
    let objectType = typesResolver.toGraphQLType(klass) as GraphQLObjectType;
    return objectType.getFields()[propertyKey];
}

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
                expect(getSpecField(SomeClass, 'field').type).to.eql(GraphQLString);
            });

            it("sets thunkType and resolves it", () => {
                someClassFieldsMetadata.getField('field').setTypeThunk(() => GraphQLString);
                expect(getSpecField(SomeClass, 'field').type).to.eql(GraphQLString);
            });

            it("wraps type with GraphQLList if list property is set to true", () => {
                someClassFieldsMetadata.getField('field').setListType(GraphQLString);
                expect(getSpecField(SomeClass, 'field').type).to.eql(new GraphQLList(GraphQLString));
            });

            it("wraps type with GraphQLNonNull if list property is set to true", () => {
                someClassFieldsMetadata.getField('field').setType(GraphQLString);
                someClassFieldsMetadata.getField('field').setNonNullConstraint();
                expect(getSpecField(SomeClass, 'field').type).to.eql(new GraphQLNonNull(GraphQLString));
            });

            it("wraps type with GraphQLNonNull and GraphQLList for nonNull and array properties set to true", () => {
                someClassFieldsMetadata.getField('field').setListType(GraphQLString);
                someClassFieldsMetadata.getField('field').setNonNullConstraint();
                expect(getSpecField(SomeClass, 'field').type).to.eql(new GraphQLNonNull(new GraphQLList(GraphQLString)));
            });

            it("wraps type using GraphQLNonNull and GraphQLList for nonNull, array, nonNullItem properties set to true", () => {
                let field = someClassFieldsMetadata.getField('field');
                field.setListType(GraphQLString);
                field.setNonNullConstraint();
                field.setNonNullItemsConstraint();

                expect(getSpecField(SomeClass, 'field').type).to
                    .eql(new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))));
            });

            it("sets description property", () => {
                someClassFieldsMetadata.getField('field').setType(GraphQLString);
                someClassFieldsMetadata.getField('field').setDescription('some description');
                expect(getSpecField(SomeClass, 'field').description).to
                    .eql('some description');
            });

            it('sets resolve property', () => {
                function resolveIt(){}

                someClassFieldsMetadata.getField('field').setType(GraphQLString);
                someClassFieldsMetadata.getField('field').setResolver(resolveIt);
                expect(getSpecField(SomeClass, 'field').resolve).to
                    .eq(resolveIt);
            });

            it('sets deprecationReason');
        });
    });

});