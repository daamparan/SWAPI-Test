//  apiFilms.test.js

//  import request agent and tryRequest function from base.test.js
const { tryRequest, createRequest } = require('../base.test');

//  Initialize the request agent
const agent_swapi = createRequest();

let response = null

//  Additional set up for this particular test file
beforeEach(async () => {
    console.log('Getting Films API Response');
    response = await tryRequest(agent_swapi, 'GET', '/films');
    //  we could also add further authentication here if needed but this endpoint does not require it
})

test('Valid Response Code on Success', () => {
    expect(response.status).toBe(200);
})

test('Valid Response Data Returned', () => {
    expect(response.status).toBe(200);
    expect(response.body).not.toBe(null)
})

test('Valid Number of Films Returned', () => {
    expect(response.body.count).toBe(6);
})

describe('Test Error Handling', () => {
    //  We use the same agent to make a request to an incorrect endpoint for error handling testing
    //  This before applies to tests within this block and is done only once therefore using the same response
    let errorResponse = null;

    beforeAll(async () => {
        console.log('Getting Incorrect API Response');
        errorResponse = await tryRequest(agent_swapi, 'GET', '/films/7');
    });

    test('Valid Response Code on Error', () => {
        expect(errorResponse.status).toBe(404);
    });
    
})
