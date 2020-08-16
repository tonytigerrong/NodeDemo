/**
 * 1. npm install -D jest
 * 2. change script.test to jest in package.json
 * 3. run test file via 'npm run test'
 *
 * // async promise test
 * https://medium.com/better-programming/integration-tests-in-node-js-f44a389a4144
 * 
 * // e2e automation test via puppetteer
 * https://www.youtube.com/watch?v=K7AHtWR2Zyk
 */
const CommonFuns = require('./CommonFuns');

test('Dummy test',()=>{
    const result = 2*3;
    expect(result).toBe(6);
});

/**
 * https://jestjs.io/docs/en/asynchronous
 */
test('Get Mysql Connection',async ()=>{
    const commonFuns = new CommonFuns();
    let rows = await commonFuns.exeSql('select * from employee');
    // TODO 
    //expect(rows[0]).toBe(1);
});