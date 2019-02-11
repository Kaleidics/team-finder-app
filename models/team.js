'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const teamSchema = mongoose.Schema({
    members: {
        creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        joiners: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }
    },
    sport: String,
    title: String,
    membersLimit: Number,
    description: String,
    location: {
        latitude: Number,
        longitude: Number
    }

});

var Team = mongoose.model('Team', teamSchema);

module.exports = Team;