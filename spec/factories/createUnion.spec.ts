import {type} from "../../lib";
import {createUnion} from "../../lib";
import * as _ from 'lodash';
import {expect} from 'chai';
import {GraphQLString} from "graphql";
import {field} from "../../lib";
import {TypeMetadata} from "../../lib/types-metadata/TypeMetadata";

describe(".createUnion", () => {
    let SomeUnionTypeDefinition;

    @type()
    class SomeType {
        @field(GraphQLString)
        someField:string;
    }

    @type()
    class SomeOtherType {
        @field(GraphQLString)
        someField:string;
    }


    beforeEach(() => {
        SomeUnionTypeDefinition = createUnion('SomeUnionType', [SomeType, SomeOtherType], _.noop);
    });

    describe("inferring of decorated type classes", () => {
        it("accepts decorated classes", () => {
            let types = SomeUnionTypeDefinition.getTypes();
            expect(types[0]).to.eq(TypeMetadata.getForClass(SomeType).toGraphQLObjectType());
            expect(types[1]).to.eq(TypeMetadata.getForClass(SomeOtherType).toGraphQLObjectType());
        });
    });
});