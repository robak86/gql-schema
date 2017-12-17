import {expect} from 'chai';
import {field, input} from "../../lib";
import {GraphQLString} from "graphql";
import {ParamsMetadata} from "../../lib/types-metadata/ParamsMetadata";
import {getMetadata} from "../../lib/utils/metadata";


describe("@input", () => {
    describe("@input()", () => {
        @input({description: 'Some description'})
        class SomeInputParams {
            @field(GraphQLString) someDummyField:string;
        }

        it("attaches metadata object", () => {
            expect(getMetadata(SomeInputParams)).to.be.instanceof(ParamsMetadata)
        });

        it("sets default name using class name", () => {
            expect(ParamsMetadata.getForClass(SomeInputParams).config.get('name')).to.eq('SomeInputParams');
        });

        it("sets description property", () => {
            expect(ParamsMetadata.getForClass(SomeInputParams).config.get('description')).to.eq('Some description');
        });
    });
});