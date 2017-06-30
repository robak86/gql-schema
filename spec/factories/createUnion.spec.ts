import {type} from "../../lib/decorators/type";
import {createUnion} from "../../lib/factories/createUnion";
import * as _ from 'lodash';
import {ObjectTypeMetadata} from "../../lib/metadata/ObjectTypeMetadata";
import {expect} from 'chai';

describe(".createUnion", () => {
    let SomeUnionTypeDefinition;

    @type.define()
    class SomeType {
    }

    @type.define()
    class SomeOtherType {
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