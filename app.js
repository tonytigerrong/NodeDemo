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

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Abcd1234!',
    database: 'crudapi'
});

connection.connect(function(error){
    if(!!error){
        console.log('db connection err',error);
    }     
});
connection.query("select * from employee",(error,rows,fields)=>{
    if(!!error){

    }else{
        console.log(rows);
        console.log(fields);
    }
});

var cryptr = new Cryptr('secret');
var encryptString = cryptr.encrypt("mypassword");
var decryptString = cryptr.decrypt(encryptString);
console.log(encryptString,decryptString);

const emitter = new EventEmitter();
const app = express();
const logger = new Logger();

emitter.on('message',(arg)=>{
    console.log('event listener',arg);
});
logger.on('logEvent',(message)=>{
    console.log('INFO:',message);
});

app.use('/public',express.static(path.join(__dirname,'static')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// middel ware
app.use((req,res,next)=>{
    logger.log(req.url + '/' + req.method);
    req.banana = 'banana.login';
    next();
});
app.set('view engine','ejs');

const people = require('./router/people');
app.use('/people',people);

app.get('/:userQuery',(req,res)=>{
    //res.sendFile(path.join(__dirname,'static', 'index.html'));
    console.log(req.banana);
    emitter.emit('message',{
        username: 'david@gmail.com',
        passsword: '$$$$$$'
    });
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
    // Joi.validate(req.body,schema,(err,result)=>{
    //     if(err){
    //         console.log(err);
    //         res.send(err);
    //     }else{
    //         res.send('post ok');
    //     }
    // });
    res.send('post ok');
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