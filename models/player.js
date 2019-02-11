'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const playerSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: {
        type: String,
        unique: true,
        required: true
    },

    //where the array will contain instances of postsSchema, how to point to postsSchema?
    //{type: mongoose.Schema.Types.ObjectId, ref: 'Post'} correct?
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
});


var Player = mongoose.model('Player', playerSchema);


module.exports = Player;