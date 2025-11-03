/**
 * ElasticSearchLevelController
 * Store and retrieve current level from elasticsearch
**/

const ElasticSearch = require('elasticsearch');
const Errors = require('data-elevator/lib/errors/elevator-errors');
const BaseLevelController = require('data-elevator/lib/level-controllers/base-level-controller.js');
const Level = require('data-elevator/lib/level-controllers/level.js');

let elasticSearchClient = null;

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
    return new Promise((resolve, reject) => {
      if (!elasticSearchClient) {
        elasticSearchClient = ElasticSearch.Client(this.config.levelControllerConfig.connectionOptions);
      }

      elasticSearchClient.indices.exists({ index: this.config.levelControllerConfig.index }, (error, exists) => {
        if (error) {
          reject(error);
          console.log("Error checking index existence:", error);
        } else if (exists) {
          resolve(elasticSearchClient);
        } else {
          elasticSearchClient.indices.create({ index: this.config.levelControllerConfig.index }, (error, response) => {
            if (error) {
              reject(error);
              console.log("Error creating index:", error);
            } else {
              resolve(elasticSearchClient);
              console.log("Index created successfully:", response);
            }
          });
        };
      });
    });
  }

  /**
     * Save level
     * @param level
     * @param callback(error)
     */
  saveCurrentLevel(level, callback) {
      const client = this.getClient().then((client) => {
      console.log("Saving level to ElasticSearch:", level);
      //Check if level already exists
      try {

      } catch (error) {
        console.log("Error checking level existence in ElasticSearch:", error);
      }
      client.exists({
        index: this.config.levelControllerConfig.index,
        type: this.config.levelControllerConfig.typeName,
        id: '1',
      }, (error, response) => {
        console.log("Existence check result:", error, response);
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
            }, (error, _response) => {
              if (error) {
                return callback(Errors.generalError("ElasticSearch failed update status level in index '" + this.config.levelControllerConfig.index + "'", error));
              } else {
                return callback(null);
              }
            });
            //If not exists then create
          } else {
            console.log("Creating new level entry in ElasticSearch");
            client.create({
              index: this.config.levelControllerConfig.index,
              type: this.config.levelControllerConfig.typeName,
              id: '1',
              body: level
            }, (error, _response) => {
              if (error) {
                return callback(Errors.generalError("ElasticSearch failed create status level in index '" + this.config.levelControllerConfig.index + "'", error));
              } else {
                return callback(null);
              }
            });
          }
        } else {
          console.log("Error checking status level existence in ElasticSearch:", error);
          return callback(Errors.generalError("ElasticSearch failed check status level existence in index '" + this.config.levelControllerConfig.index + "'", error));
        }
      });      
    });
    }

  /**
     * Retrieve the current level
     * @param callback(error, level)
     */
  retrieveCurrentLevel(callback) {
      this.getClient().then((client) => {
        console.log("Retrieving level from ElasticSearch");
        //Get level from elasticseasrch
        client.get({
          index: this.config.levelControllerConfig.index,
          type: this.config.levelControllerConfig.typeName,
          id: '1'
        }, (error, response) => {
          console.log("Retrieve result:", response);
          console.log("Retrieve error result:", error);
          console.log("----------------")
          if (response && response.found !== undefined) {
          console.log("bla result:", error, response);
            if (response.found === false) {
              return callback(null, null);
            } else {
              return callback(null, Level.fromJson(JSON.stringify(response._source)));
            }
          } else {
   //         return callback(Errors.generalError("ElasticSearch failed retrieve status level from index '" + this.config.levelControllerConfig.index + "'", error));
          }
        });
      }).catch((error) => {
                  console.log("bla2 result:", error);

   //     return callback(Errors.generalError("ElasticSearch client error", error));
      })
    }
}

module.exports = ElasticSearchLevelController;