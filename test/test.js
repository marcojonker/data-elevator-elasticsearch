/**
 * Test function for data elevator
**/

'use strict'

var TestBase = require('../node_modules/data-elevator/test/test-base.js');
var path = require('path');
var ElasticSearchLevelController = require('../lib/level-controllers/elasticsearch-level-controller.js');

var test = new TestBase(path.normalize(path.join(__dirname, '../')), ElasticSearchLevelController);
test.runDefaultCommandTests();
