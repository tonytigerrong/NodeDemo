const mongoose = require('mongoose');

/**
 * define a schema of collection 'users'
 * if we need define a schema join to collections
 *  - https://stackoverflow.com/questions/26818071/mongoose-schema-hasnt-been-registered-for-model
 *      - collumnName : { 
 *                          type: Schema.Types.ObjectId, // foreign key
 *                           ref: 'User' // foreign collection
 *                       }
 */
var CustomerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
});
// schema name in mongoose, schema, collection name
mongoose.model('users',CustomerSchema, 'users' );




