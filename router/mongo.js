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