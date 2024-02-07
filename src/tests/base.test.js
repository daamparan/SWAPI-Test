//  base.test.js 
//  Will contain the base configuration for all tests. Set up, tear down, and other common test configurations will be placed here.

//  Using supertest to test the API
const request = require('supertest');

beforeEach(() => {
    console.log('Starting Test');
});

afterEach(() => { 
    console.log('Test Finished');
});


//  This function will attempt to make a request to the API and retry if it fails x number of times
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

//  This function will return the agent with the URL we are initializing the tests with 
function createRequest() {
    return request('https://swapi.dev/api');
}

function extractApiPath(url) {
    const parts = url.split('/api/');
    //  check if the parts is more than 1 meaning the url contains info after the /api/ part
    //  from there  we return the second part of the split 
    return parts.length > 1 ? parts[1] : null;
}

//  The base URL for the API is set here with the supertest agent initialized
module.exports = { 
    tryRequest,
    createRequest,
    extractApiPath
};