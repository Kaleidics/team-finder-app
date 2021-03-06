const express = require('express');
const { Player } = require('./models');
const router = express.Router();
const bodyParser = require('body-parser');


//Register a new user
router.post('/register', (req, res) => {
    const requiredFields = ['userName', 'password'];
    console.log('here', req.body);
    const missingField = requiredFields.find(field => !(field in req.body));

    if(missingField) {
        return res.sendStatus(422).json({
            status: 422,
            missing: missingField
        });
    }

    const stringFields = ['fullName', 'userName', 'password'];
    const nonStringField = stringFields.find(
        field => field in req.body && typeof req.body[field] !== 'string'
    );

    if(nonStringField) {
        return res.sendStatus(422).json({
            status: 422,
            message: 'Incorrect field type: expected string'
        })
    }
console.log('made it past first check');
//Check for white spaces in username and password. Need to reject if they include
//white spaces because will cause unintended user experience e.g. mistype registration
//and unseen spaces for login attempts

    //check if trimmed field is same as original field
    const trimFields = ['userName', 'password'];
    const nonTrim = trimFields.find(
        field => req.body[field].trim() !== req.body[field]
    );
console.log('made it to 1.1')//failing
    //if trimmed field is not same as original field
    if(nonTrim) {
        return res.status(422).json({
            status: 422,
            message: 'Cannot start or end with whitespace',
            location: nonTrim
        });
    }
console.log('made it to 1.5');
    const limitFields = {
        userName: {
            min: 3
        },
        password: {
            min: 6,
            max: 72
        }
    }
    //see if true: user input field is less than three or six
    const tooSmallField = Object.keys(limitFields).find(
        field => 'min' in limitFields[field] && req.body[field].trim().length < limitFields[field].min
    );
console.log('made it to 2.2');

    //see if true: user input field is greater than 72
    const tooLargeField = Object.keys(limitFields).find(
        field => 'max' in limitFields[field] && req.body[field].trim().length > limitFields[field].max
    );
console.log('made it to 2.3');//failing
    //return an error if either cases are true
    if(tooSmallField || tooLargeField) {
        return res.status(422).json({
            status: 422,
            reason: 'Validation Error',
            message: tooSmallField ? `Must be at least ${limitFields[tooSmallField].min} characters long`: `Must be at most ${limitFields[tooLargeField].max} characters long`,
            location: tooSmallField || tooLargeField
        });
    }
console.log('made it past 2nd check');
    //finish input checks, now persist to db
    let {userName, password, fullName = ''} = req.body;
    //userName and password already checked for trim
    //trim non-crediential name has no side effect
    fullName = fullName.trim();
    //check for existing user
    return Player.findOne({userName})
        .then(player => {
            if(player) {
                console.log('username already exists');
                return res.status(422).json({
                    status: 422,
                    message: 'Username already taken'
                });
            }
            //if there is no existing user, hash the password
            console.log('hashing password');
            return Player.hashPassword(password);
        })
        //then pass hash password and persist new user
        .then(hash => {
console.log('passed all tests, start persist'); //still running even though should have exited on like 98?
            return Player.create({
                userName,
                password: hash,
                fullName
            });
        })
        .then(player => {
            return res.sendStatus(201).json(player.serialize());
        })
        .catch(err => {
            res.sendStatus(500).json({message: 'Internal server error'});
        });
});

module.exports = {router};