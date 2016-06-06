/**
 * Elevator
 * Data elevator
**/

'use strict'

var ElevatorBase = require('data-elevator/lib/elevator-engine/elevator-base');
var ConsoleLogger = require('data-elevator/lib/logger/console-logger');
var ElasticSearchLevelController = require('./lib/level-controllers/elasticsearch-level-controller.js');

//__dirname is added only for the construct command so construct command knows where to find its resources
var elevator = new ElevatorBase(new ConsoleLogger(false), ElasticSearchLevelController, __dirname);
elevator.run(function(error) { });

