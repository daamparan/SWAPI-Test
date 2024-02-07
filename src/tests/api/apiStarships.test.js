//  apiStartships.test.js

//  import request agent and tryRequest function from base.test.js

const { tryRequest, createRequest } = require('../base.test');

const agent_swapi = createRequest();

let response = null;

//  Additional set up for this particular test file
beforeEach(async () => {
    console.log('Getting Starships API Response');
    response = await tryRequest(agent_swapi, 'GET', '/starships');
});

test('Valid Response Code on Success', () => {
    expect(response.status).toBe(200);
});
