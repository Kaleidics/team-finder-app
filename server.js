'use strict';
// require('dotenv').config(); 
const express = require('express');
const mongoose = require("mongoose");
// const users = require('./routes/users');
const morgan = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');


// Here we use destructuring assignment with renaming so the two variables
// called router (from ./players and ./auth) have different names
const {router: playersRouter } = require('./players');
// const { router: authRouter, localStrategy, jwtStrategy } = require('./auth')
//config.js controls constants for entire app

//use es6 promises
mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config/config');

const app = express();

//logging
app.use(morgan('common'));

//parse application/json
app.use(bodyParser.json())


//CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

// passport.use(localStrategy);
// passport.use(jwtStrategy);

app.use('/api/players/', playersRouter);
// app.use('/api/teams');
// app.use('/api/auth/');

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