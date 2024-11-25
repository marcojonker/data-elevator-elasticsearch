/**
 * ElasticSearchLevelController
 * Store and retrieve current level from elasticsearch
**/

var async = require('async');

const { Client } = require('@elastic/elasticsearch')
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
  }

  /**
     * Get configurated client
     * @returns client 
     */
  getClient(callback) {
    if (!elasticSearchClient) {
      elasticSearchClient = new Client(this.config.levelControllerConfig.connectionOptions);
    }

    elasticSearchClient.indices.create({ index: this.config.levelControllerConfig.index }).then((result) => {
      return callback(elasticSearchClient);
    }, (error) => {
      return callback(elasticSearchClient);
    })
  }

  /**
     * Save level
     * @param level
     * @param callback(error)
     */
  saveCurrentLevel(level, callback) {
    this.getClient((client) => {
      //Check if level already exists
      client.exists({
        index: this.config.levelControllerConfig.index,
        id: '1',
      }).then((response) => {
        //If exists then update
        if (response === true) {
          client.update({
            index: this.config.levelControllerConfig.index,
            id: '1',
            body: {
              doc: level
            }
          }).then((response) => {
            return callback(null);
          }, (error) => {
            return callback(Errors.generalError("ElasticSearch failed update status level in index '" + this.config.levelControllerConfig.index + "'", error));
          });
          //If not exists then create
        } else {
          client.index({
            index: this.config.levelControllerConfig.index,
            id: '1',
            body: level
          }).then((response) => {

            return callback(null);
          }, (error) => {
            return callback(Errors.generalError("ElasticSearch failed create status level in index '" + this.config.levelControllerConfig.index + "'", error));
          });
        }
      }, (error) => {
        return callback(Errors.generalError("ElasticSearch failed check status level existence in index '" + this.config.levelControllerConfig.index + "'", error));
      });
    });
  }

  /**
     * Retrieve the current level
     * @param callback(error, level)
     */
  retrieveCurrentLevel(callback) {
    this.getClient((client) => {
      client.exists({
        index: this.config.levelControllerConfig.index,
        id: '1'
      }).then((response) => {
        if (response === false) {
          return callback(null, null);
        } else {
          client.get({
            index: this.config.levelControllerConfig.index,
            id: '1'
          }).then((response) => {
            return callback(null, Level.fromJson(JSON.stringify(response._source)));
          }, (error) => {
            return callback(Errors.generalError("ElasticSearch failed retrieve status level from index '" + this.config.levelControllerConfig.index + "'", error));
          });
        }
      }, (error) => {
        return callback(Errors.generalError("ElasticSearch failed retrieve status level from index '" + this.config.levelControllerConfig.index + "'", error));
      });
    });
  }
}

module.exports = ElasticSearchLevelController;