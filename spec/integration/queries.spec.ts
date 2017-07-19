import {graphql, GraphQLSchema} from "graphql";
import {createSchema} from "../../lib/factories/createSchema";
import {Query} from "./types/Query";
import {Mutation} from "./types/Mutation";
import {expect} from 'chai';
import {getAllUsers, getCompanyById, getUserByFirstName, getUserById, UserEntity} from "./resolvers/data";
import * as _ from 'lodash';

describe("root query", () => {
    let schema:GraphQLSchema;
    beforeEach(() => {
        schema = createSchema(Query, Mutation)
    });

    describe("users", () => {
        it("returns all users", async () => {
            let query = `
                query {
                    users {
                        id
                        firstName
                        firstNameUpperCase
                        role
                        employers {
                            id
                            name
                        }
                    }
                }
            `;

            let response = await graphql(schema, query);

            expect(response.data.users).to.eql(getAllUsers().map((user:UserEntity) => {
                return {
                    ..._.omit(user, ['employersIds']),
                    firstNameUpperCase: user.firstName.toUpperCase(),
                    employers: _.map(user.employersIds, id => _.omit(getCompanyById(id), 'employeesIds'))
                }
            }));
        });

        it("returns user filtered by firstName", async() => {
            let query = `
                query Users($firstName: String){
                    users(params: {firstName: $firstName}) {
                        id
                    }
                }
            `;

            let response = await graphql(schema, query,{}, {}, {firstName: 'J'});

            expect(response.data.users).to.eql(getUserByFirstName('J').map((user:UserEntity) => {
                return {id: user.id}
            }));
        });
    });
});