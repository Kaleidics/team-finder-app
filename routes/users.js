const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const Player = require('../models/player');

router.post('/register', (req, res) => {
    //check if user submitted required fields
    const requiredFields = ['userName', 'password'];
    for (let i=0; i<requiredFields.length; i++) {
        let currentField = requiredFields[i];
        if (!(req.body.hasOwnProperty(currentField))) {
            return res.status(422).json({
                missing: currentField
            });
        }
    }

    Player.findOne({
        userName: req.body.userName
        })
        .then(player => {
            if(player) {
                console.log('Username already exists');
                return res.status(400).json({
                    message: 'Username already exists'
                })
            }
        });
    //hash user password input, persist user to database
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        Player
            .create({
                userName: req.body.userName,
                password: hash
            }, function (err, player) {
                if (err) {
                    //todo = implement error case
                    return res.status(400).json({
                        message: 'something went wrong'
                    });
                }
                console.log('it worked', player);
                return res.status(201).json({
                    message: 'something went wrong'
                })

            });
    })
    .catch(err => res.status(500).json({ message: "Cannot register user"}))
    // Player
    //     .create({
    //         userName: req.body.userName,
    //         password: req.body.password
    //     }, function(err, player) {
    //         if(err) {
    //             //todo = implement error case
    //             return res.send(400, `failed to create user`);
    //         }
    //         console.log('it worked', player);
    //         return res.send(201, `created`)

    //     });
});

module.exports = router;