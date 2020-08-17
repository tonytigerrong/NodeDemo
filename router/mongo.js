const MongoClient = require('mongodb').MongoClient;
const route = require('express').Router();

/**
 * mongodb: user: tonyrong, password: tonyrong, 
 *          dbname: test, collectionname: customer
 *          schema: firstName, lastName
 * 
 * mongodb://tonyrong:tonyrong@127.0.0.1:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false
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