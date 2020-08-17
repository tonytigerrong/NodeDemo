const express = require('express');
const route = express.Router();

route.get('/users',(req, res)=>{
    res.send('api/users');
});

module.exports = route;