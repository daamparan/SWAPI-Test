# SWAPI-Test 

## Overview
The SWAPI-Test project serves as an automation framework for testing API and other web/app related items. In specific, this project
is only conducting API testing, but is set up in a way that it can be extended to handle other testing as well that includes, but is not limited to UI and E2E testing.

The main API under test is Star Wars API, more info found here [Star Wars API](https://swapi.dev/). In short, it provides all the Star Wars data. The main endpoints for this API include 
- Root: https://swapi.dev/
- People: https://swapi.dev/people
- Planets: https://swapi.dev/api/planets/
- Films: https://swapi.dev/api/films/
- Species: https://swapi.dev/api/species/
- Vehicles: https://swapi.dev/api/vehicles/
- Starships: https://swapi.dev/api/starships/

A sample response can be - 
- https://swapi.dev/api/ 
```json
    "people": "https://swapi.dev/api/people/",
    "planets": "https://swapi.dev/api/planets/",
    "films": "https://swapi.dev/api/films/",
    "species": "https://swapi.dev/api/species/",
    "vehicles": "https://swapi.dev/api/vehicles/",
    "starships": "https://swapi.dev/api/starships/"
```
- https://swapi.dev/api/people/1
```json
{
    "name": "Luke Skywalker",
    "height": "172",
    "mass": "77",
    "hair_color": "blond",
    "skin_color": "fair",
    "eye_color": "blue",
    "birth_year": "19BBY",
    "gender": "male",
    "homeworld": "https://swapi.dev/api/planets/1/",
    "films": [
        "https://swapi.dev/api/films/1/",
        "https://swapi.dev/api/films/2/",
        "https://swapi.dev/api/films/3/",
        "https://swapi.dev/api/films/6/"
    ],
    "species": [],
    "vehicles": [
        "https://swapi.dev/api/vehicles/14/",
        "https://swapi.dev/api/vehicles/30/"
    ],
    "starships": [
        "https://swapi.dev/api/starships/12/",
        "https://swapi.dev/api/starships/22/"
    ],
    "created": "2014-12-09T13:50:51.644000Z",
    "edited": "2014-12-20T21:17:56.891000Z",
    "url": "https://swapi.dev/api/people/1/"
}
```

## Prerequisites
1. Node 16.5.1 (or higher) & npm 8.11.0 (or higher)
2. Jest 29.7.0 (or higher)
3. SuperTest 6.3.4 (or higher)
4. SWAPI-Test cloned locally

## Installing
**Warning: Your machine requires Node.js to be able to install, run, and configure the test suite developed. Ensure to do this prior to continuing with the install**

**Recommend using nvm (Node Version Manager) to install and swap between Node versions if needed. More info found [here](https://github.com/nvm-sh/nvm)**

As SWAPI-Test is a Node project all dependencies can be installed in a matter of minutes and is able to run shortly thereafter with minimal tweaking

1. Run "npm install" 
    - A new directory will be generated called _node_modules_ which will hold all dependency files and items 

## Running/Executing the Test Suite
Much like installing the project dependencies, running the suite is easily done using npx which comes installed with npm once you install Node.js. 

To run the suite execute the following command(s) from the root folder of the project: 
- npx jest
    - This command will run all tests that are present within the test suite.

- npx jest src/tests/api/*.test.js 
    - For example, if I can replace the * with apiPeople.test.js to run that particular file
    - This applies to all test files including those that are added in the future

**Note: If you need to exclude a file from being ran, such as the base.test.js file, include it within the testPathIgnorePatterns item on the [jest.config.js file](/jest.config.js)**


## Test Suite Approach and Architecture
Although the project is set up with a minimal amount of tests, 14 in total. The project is set up already to have additional tests added onto it. Along with any other project related items such as web project or application which can go in the src directory. 
The test suite follows the Page Object Model Pattern (POM) which in short separates test code and page code. This can allow for ease of understanding, maintainability, and future ready-ness. In our case, the directories for the pages and tests are created, but may not be filled. 

The project is set up as follows - 
- node_modules (requires npm install to appear)
- src
    - pages
        - api-pages
        - ui-pages
    - tests
        - api
            - apiFilms.test.js
            - apiPeople.test.js
            - apiPlanets.test.js
            - apiSpecies.test.js
            - apiStarships.test.js
            - apiVehicles.test.js
        - e2e
        - ui
        base.test.js 
- jest.config.js
- package-lock.json
- package.json
- README.md

One main item I would like to highlight is the base.test.js file. This file contains set up, potential teardowns, and other common functions that are used across all test files. 
For example, our base set up function simply informs the console we are beginning the test while the teardown informs its ending. 
```javascript
beforeEach(() => {
    console.log('Starting Test');
});

afterEach(() => { 
    console.log('Test Finished');
});
```

However, this each test can use multiple setup and teardown functions, therefore in each of our API test files we create a set up function that will call our API endpoint, attain the data, and go from there. 
```javascript
beforeEach(async () => {
    console.log('Getting People API Response');
    response = await tryRequest(agent_swapi, 'GET', '/people');
});
```
In specific, here we use the tryRequest method which attempts to get the requst from the API a total of 3 times by default. Given that we use this whenever sending an API request it is also defined within base.test.js. The thought behind this function is that we want to avoid failing a test due to an API call failing (not intentional such as bad connection, timeout, etc). We simply attempt 3 times or can be user defined if needed. 
```javascript
async function tryRequest(agent, method, endpoint, data = null, maxAttempts = 3) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        //  Try to make the request and return the response
        try {
            let response = null;
            switch(method.toLowerCase()) {
                case 'get':
                    response = await agent.get(endpoint);
                    break;
                case 'post':
                    response = await agent.post(endpoint).send(data);
                    break;
                //  Add other methods as needed
                default:
                    throw new Error('Invalid Method: ${method}')
            }
            return response;
        //  If the request fails, log the error and try again    
        } catch (e) {
            console.error('Request failed, attempt: ', attempt + 1);
            if (attempt === maxAttempts - 1) {
                throw e;
            }
        }
    }
}
```

Another neat approach thanks to Jest is the use of the _describe_ block which allows us to tests that are under a specific scope, but pertaining to that API endpoint. For example, within [apiPeople.test.js](./src/tests/api/apiPeople.test.js) we have various tests that are using this endpoint. In our set up function, we hit the _https://swapi.dev/api/people/_, endpoint which returns the page 1 of the people data. 
```javascript
beforeEach(async () => {
    console.log('Getting People API Response');
    response = await tryRequest(agent_swapi, 'GET', '/people');
});
```

Now lets say we want to test individual data for person 1, this is still valid testing for this test file so we can use the _describe_ block to define a new _before_ set up function that will only apply to those tests. not the rest. 
For example: 
```javascript
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
```
Here we see that the ../people/1 endpoint returns the data for Anakin Skywalker. Therefore, we are able to create tests applicable to testing that response only, and the other if needed of course.
In this approach, we can retrieve information from one endpoint and validate it by cross-referencing with another endpoint. For example, in the test case _test('Valid Birth Planet for Anakin Skywalker')_, we verify the accuracy of the homeworld data point by checking if the provided endpoint exists and is correct.

## Conclusion 
Jest and SuperTest provide a super flexible, easy to read, and easy to work on test suite that provides immense scalability. Furthermore, the test suite is built on top of Node.js which allows you to keep adding further dependencies onto it as the project gets bigger and requires more items to be able to test. For example, we can add TypeScript support to the project, by installing typescript with npm install Typescript then adding ts-jest, TypeScript Jest, to also write our tests within typescript. 

Additionally, the API testing conducted here can be built upon and have many enhancements done to it from improving set up fixtures, to exploring more complicated edge cases. Although, SWAPI does not handle any kind of security features authentication testing would not be possible. Another API would have to be used to be able to develop towards that specific case. 