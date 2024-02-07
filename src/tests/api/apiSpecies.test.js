//  apiSpecies.test.js

//  import request agent and tryRequest function from base.test.js
const { tryRequest, createRequest } = require('../base.test');

const agent_swapi = createRequest();

let response = null;

//  Additional set up for this particular test file
beforeEach(async () => {
    console.log('Getting Species API Response');
    response = await tryRequest(agent_swapi, 'GET', '/species');
});

test('Valid Response Code on Success', () => {
    expect(response.status).toBe(200);
});
