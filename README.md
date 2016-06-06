# DATA ELEVATOR elasticsearch #

The data elevator elasticsearch is an easy to use and very flexible utility for migrating data sources based on the NPM module [data elevator](Link URL). The only difference is that data elevator elasticsearch stores its current migration level in a elasticsearch database.

Storing the current migration level in a database brings advantages when a project shares its data source with multiple running instances of a project. For example when multiple developers working with one database or the project runs on multiple servers.

# RELATED MODULES #

* data-elevator [npm](https://www.npmjs.com/package/data-elevator), [bitbucket](https://bitbucket.org/cacadu/data-elevator/overview)) - store elevator migration levels in file or in a custom data source
* data-elevator-mongodb [npm](https://www.npmjs.com/package/data-elevator-mongodb), [bitbucket](https://bitbucket.org/cacadu/data-elevator-mongodb/overview)) - store elevator migration levels in mongodb out of the box
* data-elevator-mysql [npm](https://www.npmjs.com/package/data-elevator-mysql), [bitbucket](https://bitbucket.org/cacadu/data-elevator-mysql/overview)) - store elevator migration levels in mysql out of the box
* data-elevator-postgres ([npm](https://www.npmjs.com/package/data-elevator-postgres), [bitbucket](https://bitbucket.org/cacadu/data-elevator-postgres/overview)) - store elevator migration levels in postgres out of the box)

# INSTALL #

```
npm install data-elevator-elasticsearch
```

# QUICKSTART #

*Note: It is best to run commands from the root directory of you project because the project handles directories relative to the location the process was started from.*

1 Construct a new data elevator for the project.
```
node ./node-modules/data-elevator-elasticsearch construct
```
2 Add a new floor.
```
node ./data-elevator/elevator add --name="add phone number to users"
```
3 Enter you migration code in the generated floor file located in './data-elevator/floors/'.

4 Move the elevator up to migrate your data.
```
node ./data-elevator/elevator up
```
5 Move the elevator down to downgrade your data
```
node ./data-elevator/elevator down --floor=3
```
# CONFIGURATION #

* **levelControllerConfig.index:** Name of the index to store the migration level in
* **levelControllerConfig.typeName:** Type name used store the migration level
* **levelControllerConfig.connectionOptions:** Connection options [npm elasticsearch](https://www.npmjs.com/package/elasticsearch)

```
var config = {
    levelControllerConfig: {
        index: null,
        typeName: null,
        connectionOptions: {
            host: null
        }
    }
}
```

# COMMANDS #

Parameters explained:

```
--<parameter_name> (<alias>, <r=required, o=optional>) <description>     
```
### construct ###

Construct a new data elevator in you project. In principle this command is only performed once per project.

```
Command: 'node ./node-modules/data-elevator-elasticsearch construct'
    
Parameters:
    --config-dir=  (-c=, o) Data elevator config dir (default=./data-elevator)
    --working-dir= (-w=, o) Location to construct elevator (def=./data-elevator)
    --verbose      (-v,  o) Verbose mode

Examples:
    node ./node-modules/data-elevator-elasticsearch construct
    node ./node-modules/data-elevator-elasticsearch construct  -c="./config"
```

### add ###

A new floor file will be created in which data migrations can be implemented. It is recommended to use the '--name' parameters for easier identification of the purpose of a floor.

```
Command:   'node ./<working-dir>/elevator add'
    
Parameters:
    --name=        (-n=, o) Custom name of the floor
    --config-dir=  (-c=, o) Data elevator config dir (default=./data-elevator)
    --working-dir= (-w=, o) Data elevator (default=./data-elevator)
    --verbose      (-v,  o) Verbose mode

Examples:
    node ./data-elevator/elevator add
    node ./data-elevator/elevator add -n="migrating users" -c="./config"
```

### up ###

Elevator will move up and perform the migrations for each floor passed by.

```
Command:    'node ./<working-dir>/elevator up'
    
Parameters:
    --floor=       (-f=, o) Floor to move to, if undefined elevator moves to the top   
    --config-dir=  (-c=, o) Data elevator config dir (default=./data-elevator)
    --working-dir= (-w=, o) Data elevator (default=./data-elevator)
    --verbose      (-v,  o) Verbose mode

Examples:
    node ./data-elevator/elevator up
    node ./data-elevator/elevator up -f=5 -c="./config"
```

### down ###

Elevator will move down and perform the migrations for each floor passed by.

```
Command:    'node ./<working-dir>/elevator down'

Parameters:
    --floor=       (-f=, r) Floor to move to
    --config-dir=  (-c=, o) Data elevator config dir (default=./data-elevator)
    --working-dir= (-w=, o) Data elevator (default=./data-elevator)
    --verbose      (-v,  o) Verbose mode

Examples:
    node ./data-elevator/elevator down -f=2
    node ./data-elevator/elevator down -f=5 -c="./config"
```

### status ###

Display the last action of the elevator.

```
Command:    'node ./<working-dir>/elevator status'

Parameters:
    --config-dir=  (-c=, o) Data elevator config dir (default=./data-elevator)
    --working-dir= (-w=, o) Data elevator (default=./data-elevator)
    --verbose      (-v,  o) Verbose mode

Examples:
    node ./data-elevator/elevator status
    node ./data-elevator/elevator status -c="./config"
```

# FLOOR TEMPLATE #

When a new floor is added the file 'floor-template.js' from the working directory is used as the template. Alterations to floor template are added to new floors. The minimal template contains at least the 'onUp' and 'onDown' function.

```
#!javascript
module.exports = {
    /**
     * Data transformation that need to be performed when migrating the data up
     * @param floorWorkerParameters - instance of FloorWorkerParameters
     * @param callback(error) - If an error is returned then all the subsequent migration will not be handled
     */
    onUp : function(floorWorkerParameters, callback) {
        return callback(null);
    }, 
    /**
     * Data transformation that need to be performed when migrating the data down
     * @param floorWorkerParameters - instance of FloorWorkerParameters
     * @param callback(error) - If an error is returned then all the subsequent migration will not be handled
     */
    onDown : function(floorWorkerParameters, callback) {
        return callback(null);
    }
}
```

### FloorWorkerParameters ###

The FloorWorkerParameters gives access to the current configuration, the logger and the current floor object. 

```
var FloorWorkerParameters = function(config, logger, floor) {
    this.config = config;
    this.floor = floor;
    this.logger = logger;
};
```

# CUSTOM STUFF #

This documentation contains only the basics about implementing a data elevator. For a more detailed documentation about the customization possibilities see the [data elevator documentation](https://www.npmjs.com/package/data-elevator).