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