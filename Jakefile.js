//     Jakefile.js v0.0.1
//     (c) 2012 Kaba AG, MIC AWM
//     (by) Jan Muehlemann (jamuhl)
//        , Adriano Raiano (adrai)

// Here we will document the common [jake](https://github.com/mde/jake) tasks generic to all other jake 
// files in other projects.

// ## used modules
// - __fs__ -> is all about filesystem [documentation](http://nodejs.org/docs/v0.3.1/api/fs.html)
// - __spawn__ -> a longer running app call in console normally exit with some exitcode [documentation](http://nodejs.org/docs/v0.3.1/api/child_processes.html#child_process.spawn)
// - __exec__ -> a simple version of console execution [documentation](http://nodejs.org/docs/v0.3.1/api/child_processes.html#child_process.exec)
// - __smoosh__ -> is a javascript compressing tool [documentation](https://github.com/fat/smoosh)
var fs = require('fs')
  , spawn = require('child_process').spawn
  , exec = require('child_process').exec;
   
// __hint:__ `jake -T` will display all avaiable tasks


// ## DOC
// run `jake doc`   
// This task will document provided modules by using [docco](http://jashkenas.github.com/docco/)
desc('Creates the documentation');
task('doc_host', [], function() {

    // add your docs to this array
    //
    // - __name__ will be displayed in output
    // - __files__ add your files (wildcards supported)
    // - __target__ folder where to output the docs
    var docs = [
        { name: 'host', 
                files: ['host/server.js',
                        'host/app/eventDenormalizer.js',
                        'host/app/hub.js', 
                        'host/app/msgmap.js',
                        'host/app/storage.js'],
                target: 'build/docs/host'}
    ];

    // __documents all items in docs array serial:__   
    // the selfcalling function next will shift the first item from the array 
    // and call the function process with itself as callback. The process 
    // function than calls the function document passing next as callback. 
    // When the callback _next_ is called it will take the next item from the array.
    (function next(e) {
        var process = function(doc, next) {
            document(doc.name, doc.files.join(' '), doc.target, next);
        };
        
        (!e && docs.length) ? process(docs.shift(), next) : console.log((e) ? e : '');
    }
    )();
});

desc('Creates the documentation');
task('doc_domain', [], function() {

    // add your docs to this array
    //
    // - __name__ will be displayed in output
    // - __files__ add your files (wildcards supported)
    // - __target__ folder where to output the docs
    var docs = [
        { name: 'domain', 
                files: ['domain/server.js',
                        'domain/app/commandHandler.js',
                        'domain/app/itemAggregate.js'],
                target: 'build/docs/domain'}
    ];

    // __documents all items in docs array serial:__   
    // the selfcalling function next will shift the first item from the array 
    // and call the function process with itself as callback. The process 
    // function than calls the function document passing next as callback. 
    // When the callback _next_ is called it will take the next item from the array.
    (function next(e) {
        var process = function(doc, next) {
            document(doc.name, doc.files.join(' '), doc.target, next);
        };
        
        (!e && docs.length) ? process(docs.shift(), next) : console.log((e) ? e : '');
    }
    )();
});

desc('Creates the documentation');
task('doc_client', [], function() {

    // add your docs to this array
    //
    // - __name__ will be displayed in output
    // - __files__ add your files (wildcards supported)
    // - __target__ folder where to output the docs
    var docs = [
        { name: 'client', 
                files: ['host/public/js/bootstrap.js',
                        'host/public/js/hub.js',
                        'host/public/js/viewmodel.js'],
                target: 'build/docs/client'}
    ];

    // __documents all items in docs array serial:__   
    // the selfcalling function next will shift the first item from the array 
    // and call the function process with itself as callback. The process 
    // function than calls the function document passing next as callback. 
    // When the callback _next_ is called it will take the next item from the array.
    (function next(e) {
        var process = function(doc, next) {
            document(doc.name, doc.files.join(' '), doc.target, next);
        };
        
        (!e && docs.length) ? process(docs.shift(), next) : console.log((e) ? e : '');
    }
    )();
});

// ### function pathDepth
// will return a string seperator with length depending on '/' count   
var pathDepth = function(str) {
    var deep = (str.split("/").length - 1) * 2;
    var sep = '';
    for (i = 0; i < deep; i++) {
        sep += ' ';
    }
    return sep;
};

// ### function dirs
// will generate an array of folders out of a string   
// __Example:__   
// passing `root/sub1/sub2` will result in   
// `{'root','root/sub1','root/sub1/sub2'}`
var dirs = function(path) {
    var parts = path.split('/')
      , arr = [];
    for (i = 0, y = 0, len = parts.length; i < len; i++) {
        var dir = parts[0];
        for (z = 1; z <= y; z++) {
            dir +=  '/' + parts[z];
        }
        arr.push(dir);
        y++;
    }
    return arr;
};

// ### function mkdirs
// will create the folders provided in the _dirs_ array   
// __hint:__ mode is permission set on folder as digit (like in chmod)
var mkdirs = function(dirs, mode, cb){
    
    var createIfNotExists = function(dir, mode, cb) {
        fs.stat(dir, function(err, stat) {
            if (stat && stat.isDirectory()) {
                cb()
            } else {
                fs.mkdir(dir, mode, cb);
            }
        });
    };
    
    // creates all folder in dirs serial
    (function next(e) {
        (!e && dirs.length) ? createIfNotExists(dirs.shift(), mode, next) : cb((e) ? e : undefined);
    })(null);
};

// ### function document
// will document passed in source string and copy docs to output folder.
var document = function(name, source, target, cb) {
    
    // first it will create the target folder and only callback on error   
    // __hint:__ the function _dirs_ will generate an array out of the target string. 
    mkdirs(dirs(target), 0755, function(err) {
        if (err) cb(err)
        
        // __execute docco__ on success `docco myFile1 myFile2`
        var docco = exec('docco ' + source, function (err, stdout, stderr) {
            
            // on error log it and pass error to callback
            if (err !== null) {
                console.log(('+  failed to document ' + name + ' files').red);
                cb(err);
            } 
            
            // else __move the files__ from the _docs folder_ to target folder `mv source target`
            else {
                var move = exec('mv docs/* ' + target, function (err, stdout, stderr) {
                    
                    // on error log it and pass error to callback
                    if (err !== null) {
                        console.log(('+  failed to move ' + name + ' documentation').red);
                        cb(error);
                    } 
                    
                    // else __remove the docs folder__ to have an empty one for next run `rm -rf folder`
                    else {
                        var remove = exec('rm -rf docs', function (err, stdout, stderr) {
                            
                            // on error log it and pass error to callback
                            if (err !== null) {
                                console.log('+  failed to remove docs folder'.red);
                                cb(error);
                            } 
                            
                            // else __log success and callback__
                            else {
                                console.log(('+  documented ' + name + ' files successfully').green);
                                cb();
                            }
                        });
                    }
                });
            }
        });
    });
};


// ### function document
// will extend the string object to append a _stylize function_ which will 
// style the console output.   
// __Example:__   
// `console.log('my string'.blue)`
function stylize(str, style) {
    
    // define the styles
    var styles = {
    //styles
    'bold'      : [1,  22], 'italic'    : [3,  23],
    'underline' : [4,  24], 'inverse'   : [7,  27],
    //grayscales
    'white'     : [37, 39], 'grey'      : [90, 39],
    'black'     : [90, 39],
    //colors
    'blue'      : [34, 39], 'cyan'      : [36, 39],
    'green'     : [32, 39], 'magenta'   : [35, 39],
    'red'       : [31, 39], 'yellow'    : [33, 39]
    };
    return '\033[' + styles[style][0] + 'm' + str + '\033[' + styles[style][1] + 'm';
}

['bold', 'underline', 'italic',
 'inverse', 'grey', 'yellow',
 'red', 'green', 'blue',
 'white', 'cyan', 'magenta'].forEach(function (style) {

    String.prototype.__defineGetter__(style, function () {
        return stylize(this, style);
    });

});
