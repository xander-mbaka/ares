//var store = require('./storage');
require('jsclass');
var Class = require('jsclass/src/core').Class;
var Console = require('jsclass/src/console').Console;
var User = require("../../domain/rbacfoundry").User;

exports.actions = function(app) {

    app.get('/session', function(req, res) {
        var sess = req.session
        if (sess.user) {
            return res.json(sess.user)
        } else {
            return res.json(false)
        }
        
    });

    app.post('/login', function(req, res) {
        var sess = req.session

        User.getAuthorizedUser(req.body.uname, req.body.pass, function (user) {
            if (user) {   
                sess.user = user;
                sess.save();
                return res.json(user)
            }else{
              return res.json(false)
           }
        });
        
    });

    app.post('/logout', function(req, res) {
        var sess = req.session
        if (sess.user) {
            sess.user = false;
            sess.save();
            return res.json(true)
        } else {
            return res.json(false)
        }
        
    });

};