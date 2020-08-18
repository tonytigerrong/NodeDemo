const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();
const CustomerModel = mongoose.model('users');
/**
 * http://localhost:4000/mongoosetest/list
 */
route.get('/list',(req, res)=>{
    // create a document into 'users' collection
    var user = new CustomerModel();
    user.firstName = 'david';
    user.lastName = 'Smith';
    user.save();
    CustomerModel.find((err, result)=>{
        if(!err){
            console.log(result);
            res.json(result);
        }else{
            console.log(err);
        }
    });
});

module.exports = route;