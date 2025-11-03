/**
 * Elevator
 * Data elevator
**/

const ElevatorBase = require('data-elevator/lib/elevator-engine/elevator-base');
const ConsoleLogger = require('data-elevator/lib/logger/console-logger');
const ElasticSearchLevelController = require('data-elevator-elasticsearch/lib/level-controllers/elasticsearch-level-controller');

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

const elevator = new Elevator(new ConsoleLogger(false), ElasticSearchLevelController);

//Run the elevator
elevator.run(function(_error) { });