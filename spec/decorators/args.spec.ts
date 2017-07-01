import {GraphQLString} from "graphql";
import {expect} from 'chai';
import {ArgumentMapMetadata} from "../../lib/metadata/ArgumentMapMetadata";
import {argumentsObject} from "../../lib/decorators/args";
import {field} from "../../lib/decorators/fields";


describe("@args", () => {
    describe("@argumentField", () => {
        it("creates registers configuration for annotated property", () => {

            @argumentsObject()
            class SomeClass {

                @field(GraphQLString)
                arg1:string
            }

            let graphQLFieldConfigArgumentMap = ArgumentMapMetadata.getOrCreateForClass(SomeClass).toGraphQLType();
            expect(graphQLFieldConfigArgumentMap['arg1'].type).to.eq(GraphQLString)
        });
    });
});