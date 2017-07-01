import {array, description, field, notNull} from "../../lib/decorators/fields";
import {GraphQLString} from "graphql";
import {FieldsMetadata} from "../../lib/metadata/FieldsMetadata";
import {expect} from 'chai';

describe("fields decorators", () => {
    describe("@field()", () => {
        class SomeClass {
            @field(GraphQLString)
            someField:string
        }

        let fieldConfig;
        beforeEach(() => {
            fieldConfig = FieldsMetadata.getForClass(SomeClass).getField('someField');
        });

        it("adds type to property config", () => {
            expect(fieldConfig.type).to.eq(GraphQLString);
        });

        it("uses defaults values", () => {
            expect(fieldConfig.notNull).to.eq(false);
            expect(fieldConfig.array).to.eq(false);
            expect(fieldConfig.notNullItem).to.eq(false);
        });
    });

    describe("@array()", () => {
        class SomeClass {
            @array(GraphQLString)
            someField:string
        }

        let fieldConfig;
        beforeEach(() => {
            fieldConfig = FieldsMetadata.getForClass(SomeClass).getField('someField');
        });

        it("adds type to property config", () => {
            expect(fieldConfig.type).to.eq(GraphQLString);
        });

        it("sets array config property to true", () => {
            expect(fieldConfig.array).to.eq(true);
        });
    });

    describe("decorators chaining", () => {
        class SomeClass {
            @description('Some Field description')
            @array(GraphQLString) @notNull()
            someField:string
        }

        let fieldConfig;
        beforeEach(() => {
            fieldConfig = FieldsMetadata.getForClass(SomeClass).getField('someField');
        });

        it("adds type to property config", () => {
            expect(fieldConfig.type).to.eq(GraphQLString);
        });

        it("sets array config property to true", () => {
            expect(fieldConfig.array).to.eq(true);
        });

        it("sets notNullItem", () => {
            expect(fieldConfig.notNullItem).to.eq(true);
        });

        it("sets notNull", () => {
            expect(fieldConfig.notNull).to.eq(true);
        });

        it("sets description", () => {
            expect(fieldConfig.description).to.eq('Some Field description');
        });
    });

});