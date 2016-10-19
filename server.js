require('jsclass');
var Class = require('jsclass/src/core').Class;
var Console = require('jsclass/src/console').Console;
var MapperRegistry = require("./data/core/mapperregistry").MapperRegistry;
var UoW = require("./data/core/unitofwork").UnitOfWork;

var User = require("./domain/rbacfoundry").User;
var Role = require("./domain/rbacfoundry").Role;
var ModuleObject = require("./domain/rbacfoundry").ModuleObject;
var ViewObject = require("./domain/rbacfoundry").ViewObject;
var ModuleObject = require("./domain/rbacfoundry").ModuleObject;
var ViewObject = require("./domain/rbacfoundry").ViewObject;
var Location = require("./domain/location").Location;
var SensorType = require("./domain/sensors").SensorType;
var Sensor = require("./domain/sensors").Sensor;
var EventType = require("./domain/sensors").EventType;
var ComplexEvent = require("./domain/security").ComplexEvent;
var SecurityLog = require("./domain/security").SecurityLog;

var UserMapper = require("./data/rbac_mapper").UserMapper;
var RoleMapper = require("./data/rbac_mapper").RoleMapper;
var ModuleMapper = require("./data/rbac_mapper").ModuleMapper;
var ViewMapper = require("./data/rbac_mapper").ViewMapper;
var LocationMapper = require("./data/ares_mapper").LocationMapper;
var SensorTypeMapper = require("./data/ares_mapper").SensorTypeMapper;
var SensorMapper = require("./data/ares_mapper").SensorMapper;
var EventTypeMapper = require("./data/ares_mapper").EventTypeMapper;
var ComplexEventMapper = require("./data/ares_mapper").ComplexEventMapper;
var SecurityLogMapper = require("./data/ares_mapper").SecurityLogMapper;

MapperRegistry.register(ViewObject.newInstance(), new ViewMapper());
MapperRegistry.register(ModuleObject.newInstance(), new ModuleMapper());
MapperRegistry.register(Role.newInstance(), new RoleMapper());
MapperRegistry.register(User.newInstance(), new UserMapper());
MapperRegistry.register(Location.newInstance(), new LocationMapper());
MapperRegistry.register(SensorType.newInstance(), new SensorTypeMapper());
MapperRegistry.register(Sensor.newInstance(), new SensorMapper());
MapperRegistry.register(EventType.newInstance(), new EventTypeMapper());
MapperRegistry.register(ComplexEvent.newInstance(), new ComplexEventMapper());
MapperRegistry.register(SecurityLog.newInstance(), new SecurityLogMapper());

var express = require('express');
var colors = require('./host/app/colors');
var socket = require('socket.io');
var app = express();
var http = require('http');
var server = http.createServer(app)
var io = socket.listen(server);
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser')

var options = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'andromeda',
    database: 'ares',
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

var sessionStore = new MySQLStore(options);

var sessionMiddleware = session({
  key: 'COOKIE@ZESTA',
  secret: 'XTR#$@QW',
  store: sessionStore,
  resave: true,
  saveUninitialized: true,
})

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(sessionMiddleware)
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));     // to support URL-encoded bodies
app.use(express.static('assets'));
app.set('view engine', 'jade');
app.set('views', __dirname + '/host/app/views');
//io.set('log level', 1);

UoW.newCurrent();

var UnitOfWork = UoW.getCurrent();

//require('./host/routes/presentation').actions(app);
require('./host/routes/user').actions(app);

//var records = require('./host/app/recordsApp')(UoW);
//records.apicalls(app); 

io.sockets.on('connection', function(socket) {
    //session = socket.request.session
    //var conn = socket.request.connection.remoteAddress;
    //console.log(colors.magenta(conn + ' -- connects to socket.io'));
      // passing express to the module
    //records.socketcalls(socket); // passing express to the module
});

//module.exports.MapperRegistry = MapperRegistry;

// START LISTENING
var port = 3050;
console.log(colors.magenta('\nStarting server on port ' + port));
server.listen(3050);

var five = require("johnny-five");
var board = new five.Board({ port: "COM24" });

board.on("ready", function() {

  Sensor.findAll(function (sensors) {
    sensors.forEach(function (sensor) {
      sensor.loadSensor(five);
    })
  })
});
