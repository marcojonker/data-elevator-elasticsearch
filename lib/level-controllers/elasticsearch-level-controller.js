/**
 * ElasticSearchLevelController
 * Store and retrieve current level from elasticsearch
**/

var async = require('async');
var ElasticSearch = require('elasticsearch');
var Errors = require('data-elevator/lib/errors/elevator-errors');
var BaseLevelController = require('data-elevator/lib/level-controllers/base-level-controller.js');
var Level = require('data-elevator/lib/level-controllers/level.js');

var elasticSearchClient = null;

/**
 * Constructor
 * @param config
 */
class ElasticSearchLevelController extends BaseLevelController {
  constructor(config) {
    super(config)

    if (!config.levelControllerConfig.connectionOptions) {
      throw Errors.invalidConfig('ElasticSearch connectionOptions missing in configuration file');
    }

    if (!config.levelControllerConfig.index || typeof config.levelControllerConfig.index !== 'string' && config.levelControllerConfig.index.length === 0) {
      throw Errors.invalidConfig("ElasticSearch 'index' missing in configuration file");
    }

    if (!config.levelControllerConfig.typeName || typeof config.levelControllerConfig.typeName !== 'string' && config.levelControllerConfig.typeName.length === 0) {
      throw Errors.invalidConfig("ElasticSearch 'typeName' missing in configuration file");
    }
  }

  /**
     * Get configurated client
     * @returns client 
     */
  getClient() {
    if (!elasticSearchClient) {
      elasticSearchClient = ElasticSearch.Client(this.config.levelControllerConfig.connectionOptions);
    }
    return elasticSearchClient;
  }

  /**
     * Save level
     * @param level
     * @param callback(error)
     */
  saveCurrentLevel(level, callback) {
    var client = this.getClient();

    //Check if level already exists
    client.exists({
      index: this.config.levelControllerConfig.index,
      type: this.config.levelControllerConfig.typeName,
      id: '1',
    }, (error, response) => {
      if (!error) {
        //If exists then update
        if (response === true) {
          client.update({
            index: this.config.levelControllerConfig.index,
            type: this.config.levelControllerConfig.typeName,
            id: '1',
            body: {
              doc: level
            }
          }, (error, response) => {
            if (error) {
              return callback(Errors.generalError("ElasticSearch failed update status level in index '" + this.config.levelControllerConfig.index + "'", error));
            } else {
              return callback(null);
            }
          });
          //If not exists then create
        } else {
          client.create({
            index: this.config.levelControllerConfig.index,
            type: this.config.levelControllerConfig.typeName,
            id: '1',
            body: level
          }, (error, response) => {
            if (error) {
              return callback(Errors.generalError("ElasticSearch failed create status level in index '" + this.config.levelControllerConfig.index + "'", error));
            } else {
              return callback(null);
            }
          });
        }
      } else {
        return callback(Errors.generalError("ElasticSearch failed check status level existence in index '" + this.config.levelControllerConfig.index + "'", error));
      }
    });
  }

  /**
     * Retrieve the current level
     * @param callback(error, level)
     */
  retrieveCurrentLevel(callback) {
    var client = this.getClient();

    //Get level from elasticseasrch
    client.get({
      index: this.config.levelControllerConfig.index,
      type: this.config.levelControllerConfig.typeName,
      id: '1'
    }, (error, response) => {
      if (response && response.found !== undefined) {
        if (response.found === false) {
          return callback(null, null);
        } else {
          return callback(null, Level.fromJson(JSON.stringify(response._source)));
        }
      } else {
        return callback(Errors.generalError("ElasticSearch failed retrieve status level from index '" + this.config.levelControllerConfig.index + "'", error));
      }
    });
  }
}

module.exports = ElasticSearchLevelController;