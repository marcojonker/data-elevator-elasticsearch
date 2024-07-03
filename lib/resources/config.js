/* eslint-disable no-undef */
var environment = process.env.NODE_ENV ? process.env.NODE_ENV : "developent";
/* eslint-enable no-undef */

var config = {
  levelControllerConfig : {
    index: null,
    typeName: 'data_elevator',
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