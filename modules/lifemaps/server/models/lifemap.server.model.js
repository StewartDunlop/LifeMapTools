'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Lifemap Schema
 */
var LifemapSchema = new Schema({
    parent: {
        type: Schema.ObjectId,
        ref: 'Lifemap'
    },
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date,
        default: Date.now
    },
    // Type
    showbody : Boolean,
    accordion : Boolean,
    draggable : Boolean,
    resizable : Boolean,
    //Positioning
    xpos: Number,
    ypos: Number,
    width: Number,
    height: Number,
    expanded_height: Number,
    title: String,
    itemType : {
        type: String,   //ROOT/
        default:'',
        trim: true
    },
    summary: {
        type: String,
        default: '',
        trim: true
    },
    data: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Lifemap', LifemapSchema);
