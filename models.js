'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: {
        type: String,
        unique: true,
        required: true
    },

    //where the array will contain instances of postsSchema, how to point to postsSchema?
    //{type: mongoose.Schema.Types.ObjectId, ref: 'Post'} correct?
    teams: []
});

const postSchema = mongoose.Schema({
    members: {
        creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        joiners: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
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

var User = mongoose.model('User', userSchema);
var Post = mongoose.model('Post', postSchema);

module.exports = {User, Post};