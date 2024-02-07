//  apiPeople.test.js

//  import request agent and tryRequest function from base.test.js
const { tryRequest, createRequest, extractApiPath } = require('../base.test');

//  Initialize the request agent 
const agent_swapi = createRequest();

let response = null;

//  Additional set up for this particular test file
beforeEach(async () => {
    console.log('Getting People API Response');
    response = await tryRequest(agent_swapi, 'GET', '/people');
});

test('Valid Response Code on Success', () => { 
    expect(response.status).toBe(200);
});

test('Check API Rate Limit - Still Within the Valid Limit', async () => {
    let response = null;
    //  Make 10 requests to the API
    for (let i = 0; i < 10; i++) {
        response = await tryRequest(agent_swapi, 'GET', '/people/' + i);
    }
    //  Validate the response code
    //  429 is the response code for rate limit exceeded
    expect(response.status).not.toEqual(429);  
});

/*
    This test is commented out because it will exceed the rate limit for the API
    and is not the final version of the test. This is just to show how to test the rate limit
    can be tested for this particular API.
*/ 

// test('Check API Rate Limit - Exceed the Valid Limit', async () => {
//     let response = null; 
//     //  Make 10,001 requests to the API. It has a limit of 10,000 requests per day
//     for (let i = 0; i < 10000; i++) {
//         response = await tryRequest(agent_swapi, 'GET', '/people/' + i);
//     }
//     //  Validate the response code 
//     //  429 is the response code for rate limit exceeded
//     expect(response.status).toEqual(429);
// }); 


//  Tests to Validate specific Character Information 
//  Anakin Skywalker information
describe('Test Anakin Skywalker Information', () => {
    let anakinResponse = null;

    beforeAll(async () => {
        console.log('Getting Anakin Skywalker Information');
        anakinResponse = await tryRequest(agent_swapi, 'GET', '/people/11');
    });

    test('Valid Name for Anakin Skywalker', () => {
        expect(anakinResponse.body.name).toBe('Anakin Skywalker');
    })

    test('Valid Birth Planet for Anakin Skywalker', async () => {
        expect(anakinResponse.body.homeworld).toBe('https://swapi.dev/api/planets/1/');
        //  Extract the path from the URL and make a request to the API
        let planetResponse = extractApiPath(anakinResponse.body.homeworld);
        //  Make a request to the API to get the planet information
        planetResponse = await tryRequest(agent_swapi, 'GET', '/' + planetResponse);
        //  Validate the planet information
        expect(planetResponse.body.name).toBe('Tatooine');
    });

    test('Valid Birth Planet for Anakin Skywalker - Incorrect Parameter', async () => {
        expect(anakinResponse.body.homeworld).toBe('https://swapi.dev/api/planets/1/');
        //  Test with the incorrect Path
        let planetResponse = '/planetsGoneWrong/1/';
        //  Make a request to the API to get the planet information
        planetResponse = await tryRequest(agent_swapi, 'GET', planetResponse);
        //  Validate the planet information
        expect(planetResponse.status).toBe(404);
        expect(planetResponse.body).toEqual( {} )
    });

    test('Valid Film Information for Anakin Skywalker', () => {
        expect(anakinResponse.body.films).toContain('https://swapi.dev/api/films/4/');
        expect(anakinResponse.body.films).toContain('https://swapi.dev/api/films/5/');
        expect(anakinResponse.body.films).toContain('https://swapi.dev/api/films/6/');
    });

});