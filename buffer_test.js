const fs = require('fs');
const { StringDecoder } = require('string_decoder');

/**
 * 
 * > Buffer.alloc(8); //allocation mem and initial them with zero
     <Buffer 00 00 00 00 00 00 00 00>
    > Buffer.allocUnsafe(8); // no initial them, only allocation
     <Buffer 40 06 04 71 b6 01 00 00>
    > Buffer.allocUnsafe(8).fill(); // initial and allocation
     <Buffer 00 00 00 00 00 00 00 00>
 */
const string = 'touche';
const buffer = Buffer.from('touche');

console.log(string, string.length);
console.log(buffer,buffer.length);


const convertMap = {
    '88':'65',
    '89':'66',
    '90':'67'
};
fs.readFile(__filename, (err, buffer)=>{
    let tag = buffer.slice(-4);
    console.log("last 4 letter:",tag);
    for(let i=0; i<tag.length; i++){
        tag[i] = convertMap[tag[i]];
    }
    //convert 'TAG: XYZ' to 'TAG: ABC'
    console.log(buffer.toString());
});

/**
 * get user input, compare buffer.toString with StringDecoder.write
 */
const decoder = new StringDecoder('utf8');
process.stdin.on('readable', ()=>{
    const chunk = process.stdin.read();
    if( chunk != null){
        const buffer = Buffer.from([chunk]);
        console.log('buffer is:', buffer);
        console.log('with .toString:', buffer.toString());
        console.log('with StringDecoder:', decoder.write(buffer));
    }
});

/**
 * we can override 'require' function for mock testing
 * 
 *
    require = function(){
        return {mocked: true};
    };
    const h = require('http');
    console.log('http:',h); // here 'h' is {mocked: true}
*/

/**
 * if(require.main == module) : means run this js file as a script ( in node prompt cmd line)
 *    -- we can get arguments via process.argv[i]
 * else                       : means being require by other js file
 *    -- we can export : module.exports = functionName
 */

/**
  * requrie: has cache, if we require twice, then only one will be require
  *     -- we can delete cache by 'delete require.cache['fileCachePath/fileCacheName']
  *     -- OR, wrap our required moduel by 'module.exports = () => { functionNameNeedDoubleRequried }
  */

/**
 * TODO: https://www.youtube.com/watch?v=X4uS1qsNIAo
 * TODO: https://www.youtube.com/watch?v=VruEWq0t8pI 
 * 
 */
//TAG: XYZ