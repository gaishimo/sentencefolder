var _ = require('underscore'),
     async = require('async'),
     mongodao = require('./mongo_dao');

module.exports = mongodao('sentences');