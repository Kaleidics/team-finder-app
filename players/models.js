'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const playerSchema = mongoose.Schema({
    fullName: String,
    userName: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
});


playerSchema.methods.serialize = function () {
    return {
        userName: this.userName || '',
        fullName: this.fullName || '',
        // teams: this
    };
};

playerSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

playerSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
};

const Player = mongoose.model('Player', playerSchema);

module.exports = { Player };