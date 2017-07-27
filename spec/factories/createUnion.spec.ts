import {type} from "../../lib/decorators/type";
import {createUnion} from "../../lib/factories/createUnion";
import * as _ from 'lodash';
import {ObjectTypeMetadata} from "../../lib/metadata/ObjectTypeMetadata";
import {expect} from 'chai';
import {GraphQLString} from "graphql";
import {field} from "../../lib";

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
            expect(types[0]).to.eq(ObjectTypeMetadata.getForClass(SomeType).toGraphQLType());
            expect(types[1]).to.eq(ObjectTypeMetadata.getForClass(SomeOtherType).toGraphQLType());
        });
    });
});