import {EnumsRegistry} from "../../lib/registry/EnumsRegistry";
import {GraphQLEnumType} from "graphql";
import {expect} from 'chai';
import * as _ from 'lodash/fp';


describe("EnumsRegistry", () => {
    enum Enum1 {
        A = 'a',
        B = 'b'
    }

    let registry:EnumsRegistry;

    beforeEach(() => {
        registry = new EnumsRegistry();
    });

    describe(".registerEnum", () => {
        it("adds enum using enum object as key", () => {
            registry.registerEnum('Enum1', Enum1);
            let graphQLEnumType:GraphQLEnumType = registry.getGraphQLEnumType(Enum1);
            expect(graphQLEnumType.name).to.eq('Enum1');
        });

        it("maps enum values", () => {
            registry.registerEnum('Enum1', Enum1);
            let graphQLEnumType:GraphQLEnumType = registry.getGraphQLEnumType(Enum1);
            expect(graphQLEnumType.getValues().map(_.pick(['name', 'value']))).to.eql([
                {
                    name: "A",
                    value: "a"
                },
                {
                    name: "B",
                    value: "b"
                }
            ]);
        });

        it("throws when given enum is already registered", () => {
            registry.registerEnum('Enum1', Enum1);
            expect(() => registry.registerEnum('Duplicate', Enum1)).to.throw();
        });
    });

    describe(".describeField", () => {
        it("sets description for given enum value", () => {
            registry.registerEnum('Enum1', Enum1);
            registry.describeField(Enum1, 'A', 'Description for A field');
            let graphQLEnumType:GraphQLEnumType = registry.getGraphQLEnumType(Enum1);
            expect(graphQLEnumType.getValue('A').description).to.eq('Description for A field')
        });
    });
});