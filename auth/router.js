'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('./config/config');
const router = express.Router();

const createAuthToken = function(user) {
    return jwt.sign({user}, config)
}