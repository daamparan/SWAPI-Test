//  base.test.js 
//  Will contain the base configuration for all tests. Set up, tear down, and other common test configurations will be placed here.

//  Using supertest to test the API
const request = require('supertest')

beforeEach(() => {
    console.log('Starting Test')
})

afterEach(() => { 
    console.log('Test Finished')
})

//  The base URL for the API is set here with the supertest agent initialized
module.exports = request('https://swapi.dev/api/');