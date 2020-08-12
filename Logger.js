const EventEmitter = require('events');
class Logger extends EventEmitter{
    log(message){
        this.emit('logEvent',message);
    }
}
module.exports = Logger;