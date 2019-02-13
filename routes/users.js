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
                // return res.status(400).json({
                //     message: 'Username already exists'
                // })
            }
        })
        .catch(err => res.status(500).json({ message: "Something went wrong" }))
    //hash user password input, persist user to database
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        if (err) {
            console.error(`Error: ${err}`);
            return res.status(400).json({error: err});
        }
        console.log(hash);

        Player
            .create({
                userName: req.body.userName,
                password: hash
            }, 
            function (err, player) {
                if (err) {
                    //todo = implement error case
                    return res.status(400).json({
                        message: 'something went wrong'
                    });
                }
                else {
                    console.log('it worked', player);
                    return res.status(201).json({
                    message: 'success'
                })
                
                }
            });
    });
});


router.post('/login', (req, res) => {
    //check if user is in the database/registered
    Player.findOne({userName: req.body.userName})
        .then(player => {
            if(!player) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }
            bcrypt.compare(req.body.password, player.password)
            .then(isMatch => {
                if(isMatch) {
                    const payload = {
                        firstName: player.firstName,
                        lastName: player.lastName,
                        userName: player.userName
                    }
                    jwt.sign(payload, 'secret', { expiresIn: 1000 }, (err, token) => {
                        if (err) {
                            console.error(`Token has error: ${err}`);
                        }
                        else {
                            res.json({
                                success: true,
                                token: token
                            });
                        }
                    });
                }
                else {
                    return res.status(401).json({
                        message: 'Wrong Username or password'
                    });
                }
            // jwt.sign(payload, 'secret', {expiresIn: 1000}, (err, token) => {
            //     if (err) {
            //         console.error(`Token has error: ${err}`);
            //     }
            //     else {
            //         res.json({
            //             success: true,
            //             token: `Bearer ${token}`
            //         });
            //     }
            // });
            });
    })
    .catch(err => res.status(500).json({message: 'Failed to login'}));

});

router.get('/playerprofile', passport.authenticate('jwt', {session: false}))
module.exports = router;