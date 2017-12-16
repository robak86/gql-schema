import {TypeWrapper} from "../../lib/types-conversion/TypeWrapper";
import {GraphQLList, GraphQLNonNull, GraphQLString} from "graphql";
import {expect} from 'chai';

describe("TypeWrapper", () => {
    let typeWrapper:TypeWrapper;

    beforeEach(() => {
        typeWrapper = new TypeWrapper();
    });

    describe("wrapping with list type", () => {
        it('wraps with GraphQLList type', () => {
            typeWrapper.setArray();
            expect(typeWrapper.wrap(GraphQLString)).to.eql(new GraphQLList(GraphQLString))
        });
    });

    describe("wrapping with nonNull", () => {
        it('wraps with GraphQLNonNull type', () => {
            typeWrapper.setNonNullConstraint();
            expect(typeWrapper.wrap(GraphQLString)).to.eql(new GraphQLNonNull(GraphQLString))
        });
    });

    describe("wrapping with list and nonNull ", () => {
        it('wraps with GraphQLNonNull type', () => {
            typeWrapper.setArray();
            typeWrapper.setNonNullConstraint();

            expect(typeWrapper.wrap(GraphQLString)).to.eql(new GraphQLNonNull(new GraphQLList(GraphQLString)));
        });
    });

    describe("wrapping with list, nonNull and nonNullItems", () => {
        it('wraps with GraphQLNonNull type', () => {
            typeWrapper.setArray();
            typeWrapper.setNonNullConstraint();
            typeWrapper.setNonNullItemsConstraint();

            expect(typeWrapper.wrap(GraphQLString)).to.eql(new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))));
        });
    });

    describe("wrapping with nonNullItems", () => {
        it('throws error', () => {
            typeWrapper.setNonNullItemsConstraint();
            expect(() => typeWrapper.wrap(GraphQLString)).to.throw()
        });
    });
});