require('jsclass');
var Class = require('jsclass/src/core').Class;
var Console = require('jsclass/src/console').Console;
var AbstractMapper = require("./data/datamapper").AbstractMapper;
var DataMap = require("./data/datamapper").DataMap;
var DomainObject = require("./data/datamapper").DomainObject;
var MapperRegistry = require("./data/mapperregistry").MapperRegistry;
var UoW = require("./data/unitofwork").UnitOfWork;
var User = require("./domain/rbacfoundry").User;
var Role = require("./domain/rbacfoundry").Role;
var ModuleObject = require("./domain/rbacfoundry").ModuleObject;
var ViewObject = require("./domain/rbacfoundry").ViewObject;
var UserMapper = require("./domain/rbac_mapper").UserMapper;
var RoleMapper = require("./domain/rbac_mapper").RoleMapper;
var ModuleMapper = require("./domain/rbac_mapper").ModuleMapper;
var ViewMapper = require("./domain/rbac_mapper").ViewMapper;
//var Patient = require("./domain/objectfoundry").Patient;
//var PatientMapper = require("./domain/objectfoundry").PatientMapper;
//var ObservationMapper = require("./domain/observationfoundry").ObservationMapper;
//var Observation = require("./domain/observationfoundry").Observation;

MapperRegistry.register(ViewObject.newInstance(), new ViewMapper());
MapperRegistry.register(ModuleObject.newInstance(), new ModuleMapper());
MapperRegistry.register(Role.newInstance(), new RoleMapper());
MapperRegistry.register(User.newInstance(), new UserMapper());
//MapperRegistry.register(Patient.newInstance(), new PatientMapper());
//MapperRegistry.register(Observation.newInstance(), new ObservationMapper());


var express = require('express')
var colors = require('./host/app/colors')
var socket = require('socket.io');
var app = express()
var http = require('http')
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
    database: 'momentum',
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

require('./host/routes/presentation').actions(app);
require('./host/routes/user').actions(app);
require('./host/routes/records').actions(app);

var records = require('./host/app/recordsApp')(UoW);
records.apicalls(app); 

io.sockets.on('connection', function(socket) {
    //session = socket.request.session
    //var conn = socket.request.connection.remoteAddress;
    //console.log(colors.magenta(conn + ' -- connects to socket.io'));
      // passing express to the module
    records.socketcalls(socket); // passing express to the module
});

module.exports.MapperRegistry = MapperRegistry;

// START LISTENING
var port = 3000;
console.log(colors.magenta('\nStarting server on port ' + port));
server.listen(3000);


