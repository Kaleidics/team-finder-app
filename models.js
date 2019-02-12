// 'use strict';
// const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;

// const playerSchema = mongoose.Schema({
//     firstName: String,
//     lastName: String,
//     userName: {
//         type: String,
//         unique: true,
//         required: true
//     },

//     //where the array will contain instances of postsSchema, how to point to postsSchema?
//     //{type: mongoose.Schema.Types.ObjectId, ref: 'Post'} correct?
//     teams: [ {type: mongoose.Schema.Types.ObjectId, ref:'Team'}]
// });

// const teamSchema = mongoose.Schema({
//     members: {
//         creator: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'},
//         joiners: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'}
//     },
//     sport: String,
//     title: String,
//     membersLimit: Number,
//     description: String,
//     location: {
//         latitude: Number,
//         longitude: Number
//     }

// });

// var Player = mongoose.model('Player', playerSchema);
// var Team = mongoose.model('Team', teamSchema);

// module.exports = {Player, Team};