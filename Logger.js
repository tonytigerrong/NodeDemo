const EventEmitter = require('events');

// define a global variable 'answer' which can be access app's scope
global.answer=42;
class Logger extends EventEmitter{
    log(message){
        this.emit('logEvent',message);
    }
}
module.exports = Logger;