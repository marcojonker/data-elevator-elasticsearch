/**
 * Elevator
 * Data elevator
**/

var ElevatorBase = require('data-elevator/lib/elevator-engine/elevator-base');
var ConsoleLogger = require('data-elevator/lib/logger/console-logger');
var ElasticSearchLevelController = require('data-elevator-elasticsearch/lib/level-controllers/elasticsearch-level-controller');

/**
 * Constructor
 * @param logger
 * @param LevelController
 */
class Elevator extends ElevatorBase {
  constructor(logger, LevelController) {
    super(logger, LevelController)
  }
}

var elevator = new Elevator(new ConsoleLogger(false), ElasticSearchLevelController);

//Run the elevator
elevator.run(function(error) { });