import {createEnum} from "../../lib";
import {expect} from 'chai';
import {GraphQLEnumType} from "graphql";

describe(".createEnum", () => {
    type Status = 'started' | 'stopped';
    const StatusType = createEnum('Status', ['started', 'stopped']);

    it("creates native GraphQLEnumType", () => {
        expect(StatusType).to.eql(new GraphQLEnumType({
            name: 'Status',
            values: {
                started: {value: 'started'},
                stopped: {value: 'stopped'}
            }
        }))
    });
});
