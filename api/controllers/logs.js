const log = require('../models/Logs');

const createlogs  = async (logs) =>{
    log.create({
        action: logs
    })
}

module.exports = createlogs;