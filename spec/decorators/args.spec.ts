import {GraphQLString} from "graphql";
import {expect} from 'chai';
import {ArgumentMapMetadata} from "../../lib/metadata/ArgumentMapMetadata";
import {field} from "../../lib/decorators/fields";
import {paramsObject} from "../../lib/decorators/paramsObject";


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