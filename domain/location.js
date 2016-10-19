require('jsclass');
var Class = require('jsclass/src/core').Class;
var DomainObject = require("../data/core/datamapper").DomainObject;
var MapperRegistry = require("../data/core/mapperregistry").MapperRegistry;
var LocationEventDetector = require("../domain/security").LocationEventDetector;

var Location = new Class(DomainObject, {

   extend: {

      create:function (name, latitude, longitude, description) {
         var obj = new this('', name, latitude, longitude, description, 1);
         obj.markNew();
         return obj;
      },

      createWithId:function (name, latitude, longitude, description, cb) {
         var self = this;
         MapperRegistry.getMapper(this.newInstance(), function (mapper) {
            self.getNextId(function (id) {
               var obj = new self(id, name, latitude, longitude, description, 1);
               obj.markNewId();
               cb(obj);
            });
         });         
      },

      findLocation:function (id, cb) {
         var self = this;
         self.findObject(id, function (location) {
            cb(location);
         });        
      },

      findLocations:function (locationIds, cb) {
         var self = this;
         var locations = [];
         locationIds.forEach(function (id) {
            self.findObject(id, function (location) {
               locations.push(location);
               if (locations.length == locationIds.length) {
                  cb(locations);
               }
            });
         });         
      },
   },
  
   initialize: function(id, name, latitude, longitude, description, status) {
      this.id = id;    
      this.name = name;
      this.latitude = latitude;
      this.longitude = longitude;
      this.description = description;
      this.status = status;
      this.sensors = [];
      this.counterMeasures = [];
      this.detectorLoaded = false;
   },

   loadObjects: function (cb) {
      if (this.id != null && this.detectorLoaded == false) {
         this.eventDetector = new LocationEventDetector(this);
         this.detectorLoaded = true;
      }
      cb();
      
   },

   setCoordinates: function(latitude, longitude) {
      this.latitude = latitude;
      this.longitude = longitude;
   },

   registerSensor: function(sensor){
      this.sensors.push(sensor);
   },

   registerCounterMeasure: function(counterMeasure){
      this.counterMeasures.push(counterMeasure);
   }

});

module.exports.Location = Location;