'use strict';
const {Strategy: LocalStrategy} = require('passport-local');
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');

const {Player} = require('../players/models');
// const {JWT_SECRET} = require('../config');
//env not working use a normal declaration
const JWT_SECRET = 'secret';

const localStrategy = new LocalStrategy((userName, password, callback) => {
    let user;
    Player.findOne({userName: userName})
        .then(_user => {
            user = _user;
            if(!user) {
                return Promise.reject({
                    reason: 'login error',
                    message: 'incorrect username or password'
                });
            }
            return user.validatePassword(password);
        })
        .then(isValid => {
            if(!isvalid) {
                return Promise.reject({
                    reason: 'login error',
                    message: 'incorrect username or password'
                });
            }
            return callback(null, user);
        })
        .catch(err => {
            if(err.reason === 'login error') {
                return callback(err, false);
            }
        });
});

const jwtStrategy = new JwtStrategy(
    {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
        algorithms: ['HS256']
    },
    (payload, done) => {
        done(null, payload.user);
    }
);

module.exports = {localStrategy, jwtStrategy};