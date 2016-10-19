require('jsclass');
var Class = require('jsclass/src/core').Class;
var Console = require('jsclass/src/console').Console;
var Hash = require('jsclass/src/hash').Hash;
var Set = require('jsclass/src/set').Set;
var Observable = require('jsclass/src/observable').Observable;
var DomainObject = require("../data/core/datamapper").DomainObject;
var MapperRegistry = require("../data/core/mapperregistry").MapperRegistry;
var Location = require("./location").Location;

var Party = require("./core/party").Party;
var Action = require("./actionfoundry").Action;
var ProposedAction = require("./actionfoundry").ProposedAction;
var Measurement = require("./actionfoundry").Measurement;
var Observation = require("./actionfoundry").Observation;
var PhenomenonType = require("./actionfoundry").PhenomenonType;
var Phenomenon = require("./actionfoundry").Phenomenon;
var Crypto = require('crypto');

var ComplexEvent = new Class(DomainObject, {

   include: Observable,

   extend: {

      create:function (name, eventIds, period, assumption, counterIds, region) {
         var obj = new this('', name, eventIds, period, assumption, counterIds, region, 1);
         obj.markNew();
         return obj;
      },

      createWithId:function (name, eventIds, period, assumption, counterIds, region, cb) {
         var self = this;
         MapperRegistry.getMapper(this.newInstance(), function (mapper) {
            self.getNextId(function (id) {
               var obj = new self(id, name, eventIds, period, assumption, counterIds, region, 1);
               obj.markNewId();
               cb(obj);
            });
         });         
      },

      allActiveContexts:function (cb) {
         var obj = new this('', name, eventIds, period, assumption, counterIds, region, 1);
         obj.markNew();
         return obj;
      },

      activateContexts:function (eventId, cb) {
         
      },

      findExistingEventContexts:function (eventId, period) {
         
      },
   },

   initialize: function (id, name, eventIds, period, assumption, counterIds, region, status) {
      this.id = id;
      this.name  = name;
      this.eventIds = eventIds;
      this.period = period;
      this.assumption = assumption;
      this.counterIds = counterIds;
      this.region = region;
      this.status = status;
   },

   checkAvailability: function (eventId) {
   },

   addToContext: function (eventId) {
   },

   recalibrateThreatLevel: function () {
      
   },

   activate: function (eventId) {
   },

   deactivate: function () {
   },
});

var SecurityLog = new Class(DomainObject, {

   include: Observable,

   extend: {

      create:function (type, name, locations, eventTypes, counterMeasures, threatLevel, startStamp, endStamp, logIds, media) {
         var obj = new this('', type, name, locations, eventTypes, counterMeasures, threatLevel, startStamp, endStamp, logIds, media, 1);
         obj.markNew();
         return obj;
      },

      createWithId:function (type, name, locations, eventTypes, counterMeasures, threatLevel, startStamp, endStamp, logIds, media, cb) {
         var self = this;
         MapperRegistry.getMapper(this.newInstance(), function (mapper) {
            self.getNextId(function (id) {
               var obj = new self(id, type, name, locations, eventTypes, counterMeasures, threatLevel, startStamp, endStamp, logIds, media, 1);
               obj.markNewId();
               cb(obj);
            });
         });         
      },

      allActiveContexts:function (cb) {
         var obj = new this('', type, name, locations, eventTypes, counterMeasures, threatLevel, startStamp, endStamp, logIds, media, 1);
         obj.markNew();
         return obj;
      },

      activateContexts:function (eventId, cb) {
         
      },

      findExistingEventContexts:function (eventId, period) {
         
      },
   },

   initialize: function (id, type, name, locations, eventTypes, counterMeasures, threatLevel, startStamp, endStamp, logIds, media, status) {
      this.id = id;
      this.type  = type;
      this.name  = name;
      this.locations  = locations;
      this.eventTypes  = eventTypes;
      this.counterMeasures = counterMeasures;
      this.threatLevel = threatLevel;
      this.startStamp = startStamp;
      this.endStamp = endStamp;
      this.logIds = logIds;
      this.media = media;
      this.status = status;
   },

   checkAvailability: function (eventId) {
   },

   addToContext: function (eventId) {
   },

   recalibrateThreatLevel: function () {
      
   },

   activate: function (eventId) {
   },

   deactivate: function () {
   },
});

var EventAggregator = new Class({
  
   initialize: function(name) {
      this.name = name;
   }

});

var LocationEventDetector = new Class({
  //Subscribes to realtime streams of sensor information
   initialize: function(location) {
      location.eventDetector = this;
      //this.sensors = new Hash();
      this.sensors = [];
      this.threatStatus = new Hash();
   },

   registerSensor: function(sensor){
      this.sensors.push(sensor);
   },

   analyzeEvent: function(sensor, event) {
      //compare to statistical average
      //assign threat level
      //
      this.name = name;
   },

   recalibrateThreatLevel: function (argument) {
      // body...
   },

   raiseAlarm: function (argument) {
      // body...
   },

   engageCountermeasure: function (argument) {
      // body...
   },

   disengageCountermeasure: function (argument) {
      // body...
   }

});

module.exports.EventAggregator = EventAggregator;
module.exports.LocationEventDetector = LocationEventDetector;
module.exports.ComplexEvent = ComplexEvent;
module.exports.SecurityLog = SecurityLog;