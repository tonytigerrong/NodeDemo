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