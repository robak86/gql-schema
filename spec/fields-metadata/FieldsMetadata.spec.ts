import {FieldsMetadata} from "../../lib/fields-metadata/FieldsMetadata";
import {GraphQLString} from "graphql";
import {expect} from 'chai'

describe(`FieldsMetadata`, () => {
    describe('inheritance', () => {
        class ParentClass {}

        let fieldsMetadata = FieldsMetadata.getOrCreateForClass(ParentClass);
        let parentField = fieldsMetadata.getField('parentField');
        parentField.setType(GraphQLString);
        parentField.setDescription('Parent Field Description');

        it('inherits all parent class properties', () => {
            class ChildClass extends ParentClass {}

            let fieldsMetadata = FieldsMetadata.getOrCreateForClass(ChildClass);
            let fields = fieldsMetadata.getFields();

            expect(fields).to.have.keys(['parentField']);
        });

        //TODO: add more test cases
    })
});