/**
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
app.set('view engine','ejs');

const people = require('./router/people');
const api    = require('./router/api');
const mongotest = require('./router/mongo');
/** using router middle ware
 *  route uri start with 'people'
 *  http://localhost:4000/people
 *  http://localhost:4000/people/user
 */
app.use('/people',people);
app.use('/api', api);
app.use('/mongotest',mongotest);
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