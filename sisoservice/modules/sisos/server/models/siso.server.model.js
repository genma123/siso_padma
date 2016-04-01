'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Siso Schema
 */
var SisoSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Siso name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Siso', SisoSchema);
