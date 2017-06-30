import {GraphQLString} from "graphql";
import {expect} from 'chai';
import {ArgumentMapMetadata} from "../../lib/metadata/ArgumentMapMetadata";
import {args} from "../../lib/decorators/args";




describe("@args", () => {
    describe("@argumentField", () => {
        it("creates registers configuration for annotated property", () => {

            class SomeClass {
                @args.field({type: GraphQLString})
                arg1:string
            }

            let graphQLFieldConfigArgumentMap = ArgumentMapMetadata.getOrCreateForClass(SomeClass).toGraphQLType();
            expect(graphQLFieldConfigArgumentMap['arg1'].type).to.eq(GraphQLString)
        });
    });
});