var _ = require('underscore'),
     async = require('async'),
     sequences_dao = require('./sequences_dao');

module.exports = sequences_dao('sentences_seq');