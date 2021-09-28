const assert = require('assert');
const path = require('path');
const fs = require('fs');
const async = require('async');

const ElevatorBase = require('data-elevator/lib/elevator-engine/elevator-base.js');
const ConsoleLogger = require('data-elevator/lib/logger/console-logger.js');

const config = require('./resources/data-elevator-test-config');
const PostgresLevelController = require('../lib/level-controllers/postgres-level-controller.js');

let elevator = null;

beforeEach(function () {
    const tempTestFilesFolder = path.join(process.cwd(), 'tmp');
    if(fs.existsSync(tempTestFilesFolder)) {
        console.log(tempTestFilesFolder);
        fs.rmdirSync(tempTestFilesFolder, { recursive: true });
    }

    elevator = new ElevatorBase(new ConsoleLogger(true), PostgresLevelController, process.cwd());
});

runTestCommand = function(index, commandTest, callback) {
    console.log("*****************************************************************");
    console.log("*** TEST " + index + ": " + commandTest.title);
    console.log("*****************************************************************");
    elevator.runCommand(commandTest.command, function (error) {
        if (error) {
            console.log("RESULT: FAILED\r\n");
        } else {
            console.log("RESULT: SUCCEEDED\r\n");
        }
        return callback(error);
    });
};

describe('Integration test', function () {
    this.timeout(10000);

    it('should not return errors while running a set of commands', (done) => {
        const commandTests = [
            { title: "DISPLAY HELP", command: { command: 'help', workingDir: "./tmp" } },
            { title: "CONSTRUCT ELEVATOR", command: { command: "construct", workingDir: "./tmp" } },
            { title: "ADD FLOOR", command: { command: "add", workingDir: "./tmp", verbose: true } },
            { title: "ADD FLOOR", command: { command: "add", workingDir: "./tmp", name: "second floor" } },
            { title: "ADD FLOOR", command: { command: "add", workingDir: "./tmp" } },
            { title: "ADD FLOOR", command: { command: "add", workingDir: "./tmp" } },
            { title: "ADD FLOOR", command: { command: "add", workingDir: "./tmp", name: "update invoice data" } },
            { title: "ADD FLOOR", command: { command: "add", workingDir: "./tmp" } },
            { title: "ADD FLOOR", command: { command: "add", workingDir: "./tmp", name: "add phone number to users" } },
            { title: "ADD FLOOR", command: { command: "add", workingDir: "./tmp" } },
            { title: "ADD FLOOR", command: { command: "add", workingDir: "./tmp" } },
            { title: "MOVE TO TOP", command: { command: "move", workingDir: "./tmp", "floor": "top" } },
            { title: "MOVE TO GROUND", command: { command: "move", workingDir: "./tmp", "floor": "ground" } },
            { title: "MOVE DOWN TO 5", command: { command: "move", workingDir: "./tmp", "floor": 5 } },
            { title: "MOVE DOWN TO 2", command: { command: "move", workingDir: "./tmp", "floor": 2 } },
            { title: "MOVE UP TO 2", command: { command: "move", workingDir: "./tmp", "floor": 2 } },
            { title: "MOVE UP TO 6", command: { command: "move", workingDir: "./tmp", "floor": 6 } },
            { title: "PRINT STATUS", command: { command: "status", workingDir: "./tmp" } },
            { title: "PRINT LIST", command: { command: "list", workingDir: "./tmp" } },
            { title: "MOVE TO GROUND", command: { command: "move", workingDir: "./tmp", "floor": "ground" } },
            { title: "PRINT STATUS", command: { command: "status", workingDir: "./tmp" } },
            { title: "PRINT LIST", command: { command: "list", workingDir: "./tmp" } },
            { title: "MOVE TO TOP", command: { command: "move", workingDir: "./tmp", "floor": "top" } },
            { title: "PRINT STATUS", command: { command: "status", workingDir: "./tmp" } },
            { title: "PRINT LIST", command: { command: "list", workingDir: "./tmp" } },
        ];

        let index = 1;

        async.eachSeries(commandTests, (commandTest, callback) => {
            if (config) {
                commandTest.command.config = config;
            }
            runTestCommand(index, commandTest, (error) => {
                assert.equal(error, null);
                index++;
                return callback(error);
            });
        }, function (error) {
            assert.equal(error, null);
            done();
        });
    });
});