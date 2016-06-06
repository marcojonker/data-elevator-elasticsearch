/**
 * ElasticSearchLevelController
 * Store and retrieve current level from elasticsearch
**/

'use strict'

var util = require('util');
var async = require('async');
var ElasticSearch = require('elasticsearch');
var Errors = require('data-elevator/lib/errors/elevator-errors');
var BaseLevelController = require('data-elevator/lib/level-controllers/base-level-controller.js');
var Level = require('data-elevator/lib/level-controllers/level.js');

/**
 * Constructor
 * @param config
 */
var ElasticSearchLevelController = function(config) {
    this.client = null;
    
    ElasticSearchLevelController.super_.apply(this, arguments);
    
    if(!config.levelControllerConfig.connectionOptions) {
        throw Errors.invalidConfig('ElasticSearch connectionOptions missing in configuration file');
    }
    
    if(!config.levelControllerConfig.index || typeof config.levelControllerConfig.index !== 'string' && config.levelControllerConfig.index.length === 0) {
        throw Errors.invalidConfig("ElasticSearch 'index' missing in configuration file");
    }

    if(!config.levelControllerConfig.typeName || typeof config.levelControllerConfig.typeName !== 'string' && config.levelControllerConfig.typeName.length === 0) {
        throw Errors.invalidConfig("ElasticSearch 'typeName' missing in configuration file");
    }
};

util.inherits(ElasticSearchLevelController, BaseLevelController);

/**
 * Get configurated client
 * @returns client 
 */
ElasticSearchLevelController.prototype.getClient = function() {
    if(!this.client) {
        this.client =  ElasticSearch.Client(this.config.levelControllerConfig.connectionOptions);
    }
    return this.client;
}

/**
 * Save level
 * @param level
 * @param callback(error)
 */
ElasticSearchLevelController.prototype.saveCurrentLevel = function(level, callback) {
    var client = this.getClient();
    var self = this;
    
    //Check if level already exists
    client.exists({
        index: self.config.levelControllerConfig.index,
        type: self.config.levelControllerConfig.typeName,
        id: '1',
    }, function(error, response) {
        if(!error) {
            //If exists then update
            if(response === true) {
                client.update({
                    index: self.config.levelControllerConfig.index,
                    type: self.config.levelControllerConfig.typeName,
                    id: '1',
                    body: {
                        doc: level
                    }
                }, function (error, response) {
                    if(error) {
                        return callback(Errors.generalError("ElasticSearch failed update status level in index '" + self.config.levelControllerConfig.index + "'", error));
                    } else {
                       return callback(null); 
                    }
                });
            //If not exists then create
            } else {
                client.create({
                    index: self.config.levelControllerConfig.index,
                    type: self.config.levelControllerConfig.typeName,
                    id: '1',
                    body: level
                }, function (error, response) {
                    if(error) {
                        return callback(Errors.generalError("ElasticSearch failed create status level in index '" + self.config.levelControllerConfig.index + "'", error));
                    } else {
                        return callback(null); 
                    }
                });    
            }
        } else {
            return callback(Errors.generalError("ElasticSearch failed check status level existence in index '" + self.config.levelControllerConfig.index + "'", error));
        }
    }); 
};

/**
 * Retrieve the current level
 * @param callback(error, level)
 */
ElasticSearchLevelController.prototype.retrieveCurrentLevel = function(callback) {
    var self = this;
    var client = this.getClient();
    
    //Get level from elasticseasrch
    client.get({
        index: self.config.levelControllerConfig.index,
        type: self.config.levelControllerConfig.typeName,
        id: '1'
    },function (error, response) {
        if(response && response.found !== undefined) {
            if(response.found === false) {
                return callback(null, null);
            } else {
                return callback(null, Level.fromJson(JSON.stringify(response._source)));
            }
        } else {
            return callback(Errors.generalError("ElasticSearch failed retrieve status level from index '" + self.config.levelControllerConfig.index + "'", error));
        }
    });
};

module.exports = ElasticSearchLevelController;