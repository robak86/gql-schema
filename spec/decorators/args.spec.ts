import {GraphQLString} from "graphql";
import {expect} from 'chai';
import {ArgumentMapMetadata} from "../../lib/metadata/ArgumentMapMetadata";
import {paramsObject} from "../../lib/decorators/args";
import {field} from "../../lib/decorators/fields";


describe("@params", () => {
    describe("@argumentField", () => {
        it("creates registers configuration for annotated property", () => {

            @paramsObject()
            class SomeClass {

                @field(GraphQLString)
                arg1:string
            }

            let graphQLFieldConfigArgumentMap = ArgumentMapMetadata.getOrCreateForClass(SomeClass).toGraphQLType();
            expect(graphQLFieldConfigArgumentMap['arg1'].type).to.eq(GraphQLString)
        });
    });
});