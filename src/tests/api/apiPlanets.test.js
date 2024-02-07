//  apiPlanets.test.js 
//  This file will contain the tests for the Planets API

//  import request agent and tryRequest function from base.test.js
const { tryRequest, createRequest} = require('../base.test')

const agent_swapi = createRequest();

let response = null;

//  Additional set up for this particular test file
beforeEach(async () => {
    console.log('Getting Planets API Response');
    response = await tryRequest(agent_swapi, 'GET', '/planets');
});

test('Valid Response Code on Success', () => {
    expect(response.status).toBe(200);
}); 
