
import {GraphQLString} from "graphql";
import {expect} from 'chai';
import {argumentField} from "../lib/decorators/argumentField";
import {ArgumentMapMetadata} from "../lib/metadata/ArgumentMapMetadata";


describe("ArgumentMapMetadata", () => {
    describe("@argumentField", () => {
        it("creates registers configuration for annotated property", () => {
            class SomeClass {
                @argumentField({type: GraphQLString})
                arg1:string
            }

            let graphQLFieldConfigArgumentMap = ArgumentMapMetadata.getOrCreateForClass(SomeClass).toGraphQLType();
            expect(graphQLFieldConfigArgumentMap['arg1'].type).to.eq(GraphQLString)
        });
    });
});