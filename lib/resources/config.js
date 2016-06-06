var environment = process.env.NODE_ENV ? process.env.NODE_ENV : "developent";

var config = {
    levelControllerConfig : {
       index: null,
       typeName: '_data_elevator',
       connectionOptions: {
           host: null
       }
    }
}

switch(environment) {
    case "development":
        break;
}

module.exports = config;