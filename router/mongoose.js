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