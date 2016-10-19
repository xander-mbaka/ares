//var store = require('./storage');
require('jsclass');
var Class = require('jsclass/src/core').Class;
var Console = require('jsclass/src/console').Console;
var User = require("../../domain/rbacfoundry").User;

exports.actions = function(app, mappers) {

    app.get('/', function(req, res) {
        res.render('index');
    });

};