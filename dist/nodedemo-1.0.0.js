/**
 * training url: https://www.youtube.com/watch?v=JnvKXcSI7yk&t=11387s
 * Node is single thread v8 engine based, used for I/O intensive processing, 
 * not for CPU intensive processing. Since when node due with one request, others will wait
 *
 */
const http = require('http');
const fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Joi = require('joi');
const EventEmitter = require('events');
const Logger = require('./Logger');
const Cryptr = require('cryptr');
const mysql = require('mysql');
const mongo_connection = require('./model');
const cors = require('cors');

/**
 * print command line arguments , via process.argv
 * access global variable 'answer' which define in Logger.js file
 * process.evn: system environment's settings
 */
console.log("argv:", process.argv, 
            "global.answer:",answer,
            //"process.env:", process.env
            "port:", process.env.PORT || 8080
            );

// do something before exit
process.on('exit', (code)=>{
    console.log(`app is about to exit with code ${code}`);
});
//"console.dog is not a function" error will be caught here
process.on('uncaughtException',(err)=>{
    console.error(err);
    process.exit(1);
});

//console.dog();
/**
 * get mysql connection instance
 */
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Abcd1234!',
    database: 'crudapi'
});

// make a connection request to mysql
connection.connect(function(error){
    if(!!error){
        console.log('db connection err',error);
    }     
});

// Excute SQL via mysql connection instance
connection.query("select * from employee",(error,rows,fields)=>{
    if(!!error){

    }else{
        rows.forEach((element,row_num) => {
            //console.log("row",row_num,element);
        });
       //console.log(fields);
    }
});

var cryptr = new Cryptr('secret');
var encryptString = cryptr.encrypt("mypassword");
var decryptString = cryptr.decrypt(encryptString);
// 1st string is encrpted string, 2nd string is decrypted string
//console.log(encryptString,decryptString);

const emitter = new EventEmitter();
const app = express();
const logger = new Logger();

emitter.on('message',(arg)=>{
    console.log('event listener',arg);
});
logger.on('logEvent',(message)=>{
    console.log('INFO:',message);
});

/** using middle ware
 * set 'static' folder an alian name 'public'
 *  form to be post to server
 *  http://localhost:4000/public/index.html
 */
app.use('/public',express.static(path.join(__dirname,'static')));

/** using middle ware
 * set 'bodyParser' to parse url of request 
 */
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

/** using costum middle ware
 * print url and method of http request
 */
app.use((req,res,next)=>{
    logger.log(req.url + '/' + req.method);
    req.banana = 'banana.login';
    next();
});
// unlock ' CORS policy'
app.use(cors());
app.set('view engine','ejs');

const people = require('./router/people');
const api    = require('./router/api');
const mongotest = require('./router/mongo');

const mongoosetest = require('./router/mongoose');
/** using router middle ware
 *  route uri start with 'people'
 *  http://localhost:4000/people
 *  http://localhost:4000/people/user
 */
app.use('/people',people);
app.use('/api', api);
app.use('/mongotest',mongotest);
app.use('/mongoosetest',mongoosetest);
/**
 * http://localhost:4000/query
 */
app.get('/:userQuery',(req,res)=>{
    //res.sendFile(path.join(__dirname,'static', 'index.html'));
    console.log(req.banana);
    emitter.emit('message',{
        username: 'david@gmail.com',
        passsword: '$$$$$$'
    });
    // using template /views/index.ejs, and 'views' folder is default folder
    res.render('index',{
        data: {
            userQuery: req.params.userQuery,
            result: ['book1','book2','book3']
        }
    });
});

app.post('/login',(req,res)=>{
    console.log(req.body);
    const schema = Joi.object().keys({
        email : Joi.string().email().required(),
        password : Joi.string().max(10).min(5).required()
    });

    // TODO: need check validation result
    const result = schema.validate(req.body);
    if(result.error){
        res.status(400).json(result.error.details[0].message);
    }
    //old syntax
    /*
    Joi.validate(req.body,schema,(err,result)=>{
        if(err){
            console.log(err);
            res.send(err);
        }else{
            res.send('post ok');
        }
    });
    */
    // set response as json object
    // res.json(result);
    // res.send('post ok');
});

app.listen(4000);
/*
const server = http.createServer((req,res)=>{
   if(req.url === "/"){
        const readStream = fs.createReadStream('./static/index.html');
        res.writeHead(200,{'Content-type':'text/html'});
        readStream.pipe(res);
   }else{
        res.write("not root page");
        res.end();
   }
   
});
server.listen(3000);
*/
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
module.exports = function(grunt){
    grunt.registerTask('speak', ()=>{
        console.log("speak task run ok");
    });
    grunt.registerTask('yelling', ()=>{
        console.log("yelling task run ok");
    });
    //grunt both: to run
    //grunt.registerTask('both',['speak','yelling']);




    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //#grunt concat
        concat: {
          js: {
            src: ['./*.js','./model/**/*','./router/**/*','./utils/**'],
            dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js',
          },
          css:{
              src:[],
              dest: 'dist/styles.css'
          }
        },
        //#grunt watch , when any file in 'files' array change, 'tasks' array will executed
        watch:{
            js: {
                files: ['./*.js','./model/**/*','./router/**/*','./utils/**'],
                tasks: ['concat']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default',['concat','watch']);
};
const EventEmitter = require('events');

// define a global variable 'answer' which can be access app's scope
global.answer=42;
class Logger extends EventEmitter{
    log(message){
        this.emit('logEvent',message);
    }
}
module.exports = Logger;
const mongoose = require('mongoose');

/**
 * define a schema of collection 'users'
 * if we need define a schema join to collections
 *  - https://stackoverflow.com/questions/26818071/mongoose-schema-hasnt-been-registered-for-model
 *      - collumnName : { 
 *                          type: Schema.Types.ObjectId, // foreign key
 *                           ref: 'User' // foreign collection
 *                       }
 */
var CustomerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
});
// schema name in mongoose, schema, collection name
mongoose.model('users',CustomerSchema, 'users' );





const mongoose = require('mongoose');

const url = 'mongodb://tonyrong:tonyrong@127.0.0.1:27017/test?authSource=admin&readPreference=primary&ssl=false';
const mongo_connetion = mongoose.connect(url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        auth:{authdb:"admin"}
    },
    (err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('mongo connected');
    }
});
require('./Customer.model');
const express = require('express');
const route = express.Router();

route.get('/users',(req, res)=>{
    res.send('api/users');
});

module.exports = route;
const MongoClient = require('mongodb').MongoClient;
const route = require('express').Router();

/**
 * https://www.w3schools.com/nodejs/nodejs_mongodb_createcollection.asp
 * mongodb details: user: tonyrong, password: tonyrong, 
 *                  dbname: test, collectionname: customer
 *                  schema: firstName, lastName
 * command line:
 *    1.client connecton to server:
 *      mongo.ext mongodb://tonyrong:tonyrong@127.0.0.1:27017/?authSource=admin&readPreference=primary&ssl=false
 *    2.show dbs;          //test
 *    3.show collections;  //customer
 *    4.use test;
 *    5.Query:
 *      db.customer.find(
 *              {
 *                  firstName: 'David'
 *              }
 *          );
 */
const url = 'mongodb://tonyrong:tonyrong@127.0.0.1:27017/'
            +'?authSource=admin&readPreference=primary&ssl=false&useUnifiedTopology=true';

/**
 * localhost:4000/mongotest/
 * show all in collection
 */
route.get('/',(req,res)=>{
    MongoClient.connect(url, (err,db)=>{
        if(err) throw err;
        var dbo = db.db('test');
        
        dbo.collection('customer').find().toArray((err, result)=>{
            if(err) throw err;
            console.log(result);
            res.json(result);
            db.close();
        });
    });
});
/**
 * localhost:4000/mongotest/David
 * show firstname==David in collection
 */
route.get('/:firstName',(req,res)=>{
    MongoClient.connect(url, (err,db)=>{
        if(err) throw err;
        var dbo = db.db('test');
        var query = { firstName: req.params.firstName };
        dbo.collection('customer').find(query).toArray((err, result)=>{
            if(err) throw err;
            console.log(result);
            res.json(result);
            db.close();
        });
    });
});
/**
 * create a new customer
 * {
	"firstName": "Smith",
	"lastName": "Newman"
    }
 */
route.post('/addcustomer',(req,res)=>{
    MongoClient.connect(url,(err,db)=>{
        if(err) throw err;
        var dbo = db.db('test');
        /**
         * dbo.collection('customer')
         *      .find().sort({firstName: 1}) //1: ascending -1: descending
         *      .deleteOne
         *      
         *      .updateOne(myquery,newvalues,)
         *          var myquery = { address: "Valley 345" };
         *          var newvalues = { $set: {name: "Mickey", address: "Canyon 123" } };
         * 
         */
        dbo.collection('customer').insertOne(req.body, (err,result)=>{
            if(err) throw err;
            res.json(req.body);
            db.close();
        });
    });
});

/**
 * update firstName==:firstName in collection
 */
route.put('/updatecustomer/:firstName',(req,res)=>{
    MongoClient.connect(url,(err, db)=>{
        if(err) throw err;
        var dbo = db.db('test');
        var query = {firstName: req.params.firstName};
        var newvalue = {$set: {
            lastName: "xxx"
        }};
        dbo.collection('customer').updateOne(query,newvalue,(err,obj)=>{
            res.json(obj);
            db.close();
        });
    });
});

/** NEED FIX, can't create collection 'orders'
 * join collections
 *  collection(customer): firstName/lastName
 *  collection(orders)  : firstName/productName
 */
route.get('/joincustomer',(req,res)=>{
    // create a new collection 'orders'
    var orders = 'orders';
    MongoClient.connect(url,(err,db)=>{
        if(err) throw err;
        var dbo = db.db('test');
        dbo.createCollection(orders,(err,res)=>{
            if(err) throw err;
            console.log('create new collection successfully!');
            db.close();
        });
        // add an order item
        var order = {firstName: 'David', productName: 'book' };
        dbo.collection(orders).insertOne(order,(err,result)=>{
            if(err) throw err;
            console.log("create order ok");
            db.close();
        });
    });
    // join orders with customer via firstName
    MongoClient.connect(url,(err,db)=>{
        if(err) throw err;
        var dbo = db.db('test');
        dbo.collection('orders').aggregate(
            [
                {
                    $lookup: {
                        from: 'customer',
                        localField: 'firstName',
                        foreignField: 'firstName',
                        as: 'order'
                    }
                }
            ]
        ).toArray(
            (err,res)=>{
                if(err) throw err;
                res.json(res);
                db.close();
            }
        );
    });
});
module.exports = route;
const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();
const CustomerModel = mongoose.model('users');
/**
 * http://localhost:4000/mongoosetest/list
 */
route.get('/list',(req, res)=>{
    // create a document into 'users' collection
    // var user = new CustomerModel();
    // user.firstName = 'david';
    // user.lastName = 'Smith';
    // user.save();
    CustomerModel.find((err, result)=>{
        if(!err){
            console.log(result);
            res.json(result);
        }else{
            console.log(err);
        }
    });
});

/**
 * create a user
 * post body:
 *  {
        "firstName": "testFirstName",
        "lastName": "testLastName"
    }
 */
route.post('/adduser',(req,res)=>{
    var user = new CustomerModel();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.save();
    res.json(user);
});
module.exports = route;
const express = require('express');
const route = express.Router();

route.use((req,res,next)=>{
    next();
});
route.get('/',(req,res)=>{
    res.send('people root page');
});

route.get('/user',(req,res)=>{
    res.send('people/user page');
});
module.exports = route;

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

const mysql = require('mysql');

class CommonFuns{
    constructor(){
        console.log("CommonFuns.constructor=>");
        this.connection = this.getConnection();
    }

    getConnection(){
        console.log("CommonFuns.getConnection=>");
        return mysql.createConnection({
                    host: 'localhost',
                    port: 3306,
                    user: 'root',
                    password: 'Abcd1234!',
                    database: 'crudapi'
                });
       
    }

    exeSql(sql){
        console.log(`CommonFuns.exeSql=>${sql}`);
        
        return 
            this.connection.query(sql,(err, rows, fields)=>{
                if(err){
                    return err;
                }else{
                    console.log("Query Result: ",rows);
                    return rows;
                }
    
            });
       
    }
}

module.exports = CommonFuns;