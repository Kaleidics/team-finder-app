'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const config = require('./config/config');
const router = express.Router();

const createAuthToken = function(user) {
    return jwt.sign({user}, config.JWT_SECRET, {
        subject: user.userName,
        expiresIn: config.JWT_EXPIRY,
        algorithm: 'HS256'
    });
}

const localAuth = passport.authenticate('local', {session: false});
router.use(bodyParser.json());

//authenticate username and password for login route
router.post('./login', localAuth, (req, res) => {
    console.log(req.user);
    const authToken = createAuthToken(req.user.serialize());
    res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

//User exchanges a valid JWT for a new one with later expiration
router.post('/refresh', jwtAuth, (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({authToken});
})


module.exports = {router};