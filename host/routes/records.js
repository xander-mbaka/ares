//var store = require('./storage');
require('jsclass');
var Class = require('jsclass/src/core').Class;
var Console = require('jsclass/src/console').Console;
var User = require("../../domain/rbacfoundry").User;

exports.actions = function(app, mappers) {

    app.get('/patient', function(req, res) {
        var sess = req.session
        if (sess.views) {
            sess.views++
            //res.setHeader('Content-Type', 'text/html')
            //res.write('<p>views: ' + sess.views + '</p>')
            //res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>')
            //res.end()
        } else {
            sess.views = 1
            res.end('welcome to the session demo. refresh!')
        }

        User.getAuthorizedUser('admin', 'admin123', function (user) {
            //Console.print(JSON.stringify(user))

           if (user) {   
              return res.json(user)
           }else{
              return res.json(false)
           }
        });
        
    });

};