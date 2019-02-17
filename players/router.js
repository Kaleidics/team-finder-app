const express = require('express');
const { Player } = require('./models');
const router = express.Router();

//Register a new user
router.post('/register', (req, res) => {
    const requiredFields = ['userName', 'password'];
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

//Check for white spaces in username and password. Need to reject if they include
//white spaces because will cause unintended user experience e.g. mistype registration
//and unseen spaces for login attempts

    //check if trimmed field is same as original field
    const trimFields = ['userName', 'password'];
    const nonTrim = trimFields.find(
        field => req.body[field].trim !== req.body[field]
    );
    //if trimmed field is not same as original field
    if(nonTrim) {
        return res.sendStatus(422).json({
            status: 422,
            message: 'Cannot start or end with whitespace',
            location: nonTrim
        })
    }
    


})