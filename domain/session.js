require('jsclass');
var Class = require('jsclass/src/core').Class;
var Console = require('jsclass/src/console').Console;
var AbstractMapper = require("../data/core/datamapper").AbstractMapper;
var DataMap = require("../data/core/datamapper").DataMap;
var DomainObject = require("../data/core/datamapper").DomainObject;
var MapperRegistry = require("../data/core/mapperregistry").MapperRegistry;
var UoW = require("../data/core/unitofwork").UnitOfWork;
var User = require("./rbacfoundry").User;


var SessionMapper = new Class(AbstractMapper, {
  
   initialize: function() {
      this.callSuper();
   },

   loadDataMap: function (object) {
      this.domainClass = object.klass;
      this.dataMap = new DataMap(this.domainClass, 'sessions');
      this.dataMap.addColumnMap('user_id', 'userId', 'int');
      //this.dataMap.addColumnMap('ip', 'ip', 'varchar');
      this.dataMap.addColumnMap('datetime', 'datetime', 'blob');
      this.dataMap.addColumnMap('starttime', 'starttime', 'int');
      this.dataMap.addColumnMap('lasttime', 'lasttime', 'int');
      this.dataMap.addColumnMap('endtime', 'endtime', 'int');
      this.mapLoaded = true;
   }

});

var SessionManager = new Class(DomainObject, {

   extend: {

      activeSessions: new Hash(),

      totalSessions:function () {
         return this.activeSessions.size;
      },

      startApplicationSession:function (user, clientsession, connection, cb) {
         self.getNextId(function (id) {
            var session = new this(id, user, clientsession, connection, new Date(Date.now()));
            session.markNewId();
            this.activeSessions.store(clientsession.id, session);
            cb(session);
         });
      },

      getSession: function (sessionId) {
         return this.activeSessions.get(sessionId);      
      },

      validateOperation:function (command, userSession) {
              
      }
   },
  
   initialize: function(id, user, session, connection, datetime) {
      this.id = id;
      this.userId = user.id;
      this.user = user;
      this.session = session;
      this.connection = connection;
      this.datetime = datetime;
      this.starttime = Math.round(datetime.getTime()/1000);
      this.expiry = 0;
      this.endtime = 0;
      this.lasttime = this.starttime;
   },

   endSession:function () {
      this.endtime = Math.round(datetime.getTime()/1000);
      this.klass.activeSessions.remove(this.connection);
   },

   logAction:function () {
      var datetime = new Date(Date.now());
      this.lasttime = Math.round(datetime.getTime()/1000); 
   }

});












