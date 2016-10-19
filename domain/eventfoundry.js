require('jsclass');
var Class = require('jsclass/src/core').Class;
var Hash = require('jsclass/src/hash').Hash;
var Set = require('jsclass/src/set').Set;
var Observable = require('jsclass/src/observable').Observable;
var Console = require('jsclass/src/console').Console;
var AbstractMapper = require("../data/core/datamapper").AbstractMapper;
var DataMap = require("../data/core/datamapper").DataMap;
var DomainObject = require("../data/core/datamapper").DomainObject; 
var Uuid = require("node-uuid");

var EventType = new Class(DomainObject, {
   initialize: function(name) {
      this.name = name;
   }
});

module.exports.EventType = EventType;

var EventStatus = new Class({
  
   initialize: function(name) {
      this.name = name;
   }

});

module.exports.EventStatus = EventStatus;

var Event = new Class(DomainObject, {

   initialize: function(name, eventType) {
      this.eventId = Uuid.v4();
      this.name = name;
      this.type = eventType;
      //this.eventLog = new Hash();
      //new Date(Date.now())
      this.dateTime = new Date(Date.now());
      this.timestamp = this.dateTime.getFullYear()+''+(this.dateTime.getMonth()+1)+''+this.dateTime.getDate()+''+this.dateTime.getHours()+''+this.dateTime.getMinutes()+''+this.dateTime.getSeconds()+''+this.dateTime.getMilliseconds();
   },

   timestamp: function(){
      return this.timestamp;
   },

   type: function(){
      if (this.type) {
         return this.type;
      } else{
         return undefined;
      };
      
   }

});

module.exports.Event = Event;

/*var Location = new Class({
  
   initialize: function(name) {
      this.name = name;
      this.entities = [];
   },

   register: function(entity){
      this.entities.push(entity)
   },

   setCoordinates: function(latitude, longitude) {
      this.latitude = latitude;
      this.longitude = longitude;
   }

});

module.exports.Location = Location;*/

var Priority = new Class(DomainObject, {

   extend:{
      besteffort: function () {
         return new this('low', 1);
         //best effort -- dependent on specified protocol
         //can be dropped or not depending on the situation of the performer
      },

      normal: function () {
         return new this('normal', 2);
         //persist to collection bucket
      },

      timed: function () {
         return new this('timed', 3);
         //persist to schedule based collection bucket i.e calendar
      },

      high: function () {
         return new this('high', 4);
         //persist to high frequency collection bucket
      },

      nextaction: function () {
         return new this('nextaction', 5);
      },

      realtime: function () {
         return new this('realtime', 6);
         //eg chat, medical instrument measurements, process control info, emergency alerts,
         //stock-ticks, 
      },

      userspecified: function (args) {
         var priority = new this('userspecified', 7)
         //var _ = require("underscore");
         //_(args).each(function (value, key) {
         //   priority[key] = value; 
         //});
         return priority;
         //can bypass the collection bucket to a specified resource holding
         //also useful when doing scheduled reviews of collection buckets
         //user defined storage areas or application accounts e.g quotes [general research content], 
         //specific research content, ideas repo, plan list/repo, structural schematics,
         //simulations, uml diagrams, pictures, applications, downloads, music videos, movies, shared plan content, 
         //background processes (e.g complex event processor), 
         //apply argument(s) of destination(s) to self
      },

   },
  
   initialize: function(name, level) {
      this.name = name;
      this.level = level;   
   }

});

module.exports.Priority = Priority;

var SensorEvent = new Class(Event, {

   initialize: function(sensorId, timestamp, value) {
      this.callSuper('', 'Sensor Event');
      this.sensorId = sensorId;
      this.timestamp  = timestamp;
      this.value = value;
      //new Date(Date.now())
   },

})



