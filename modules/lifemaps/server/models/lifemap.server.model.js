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
    information: {
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
        }
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Lifemap', LifemapSchema);
