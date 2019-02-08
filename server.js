
'use strict';

const express = require('express');
const mongoose = require("mongoose");

//config.js controls constants for entire app
const {PORT, DATABSE_URL} = require('./config');

//use es6 promises
mongoose.Promise = global.Promise;



const app = express();
app.use(express.static('public'));
app.use(express.json());


//runServer and closeServer are needed to reset between unit tests
//closeServer need access to a server object, but that is only created when
// runServer runs, so declared as global scope
let server;

//this will connect to the database and start the server
function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(
            databaseUrl, err => {

                if (err) { 
                    return reject(err); 
                }

                server = app
                    .listen(port, () => {
                        console.log(`Listening on port ${port}`);
                        resolve();
                    })
                    .on('error', err => {
                        mongoose.disconnect();
                        reject(err);
                    })
            }
        );
    });
}

//this will close the server and return a promise
function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {

                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

//if server.js is called instead of npm start, this will still run server
if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.log(err));
}

module.exports = {app, runServer, closeServer};