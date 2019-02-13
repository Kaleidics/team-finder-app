'use strict';

const express = require('express');
const mongoose = require("mongoose");
const users = require('./routes/users');
const morgan = require('morgan');
const passport = require('passport');

//config.js controls constants for entire app
const {PORT, DATABASE_URL} = require('./config');

//use es6 promises
mongoose.Promise = global.Promise;



const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(users);
//logging
app.use(morgan('common'));
//CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.send(204);
    }
    next();
});
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