const MongoClient = require('mongodb').MongoClient;
const route = require('express').Router();

/**
 * mongodb details: user: tonyrong, password: tonyrong, 
 *                  dbname: test, collectionname: customer
 *                  schema: firstName, lastName
 * command line:
 *    1.client connecton to server:
 *      mongo.ext mongodb://tonyrong:tonyrong@127.0.0.1:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false
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
            +'?authSource=admin&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false';


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

module.exports = route;