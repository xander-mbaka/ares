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

var CounterMeasureType = new Class(DomainObject, {

   extend: {

      create:function (name, type, category, logo, description) {
         var obj = new this('', name, type, category, logo, description);
         obj.markNew();
         return obj;
      },

      createWithId:function (name, type, category, logo, description, cb) {
         var self = this;
         MapperRegistry.getMapper(this.newInstance(), function (mapper) {
            self.getNextId(function (id) {
               var obj = new self(id, name, type, category, logo, description);
               obj.markNewId();
               cb(obj);
            });
         });         
      },

      findByTypeName:function (name, cb) {
         MapperRegistry.getMapper(this.newInstance(), function (mapper) {
            mapper.findWhere(mapper.findWhereNameStatement(name), function (type) {
               cb(type);
            });
         });       
      },
   },

   initialize: function (id, name, type, category, logo, description) {
      this.id = id;
      this.name  = name;
      this.type = type;
      this.category = category;
      this.logo = logo;
      this.description = description;
   }

});

var CounterMeasure = new Class(DomainObject, {

   include: Observable,

   extend: {

      create:function (name, typeId, deviceId, region) {
         var obj = new this('', name, typeId, deviceId, region, 0);
         obj.markNew();
         return obj;
      },

      createWithId:function (name, typeId, deviceId, region, cb) {
         var self = this;
         MapperRegistry.getMapper(this.newInstance(), function (mapper) {
            self.getNextId(function (id) {
               var obj = new self(id, name, typeId, deviceId, region, 0);
               obj.markNewId();
               cb(obj);
            });
         });         
      }
   },

   initialize: function (id, name, typeId, deviceId, region, status) {
      this.id = id;
      this.name  = name;
      this.typeId = typeId;
      this.deviceId = deviceId;
      this.region = region;
      this.status = status;
      
      var self = this;
      Location.findLocations(this.region.split(','), function (locations) {
         locations.forEach(function (location) {
            location.registerCounterMeasure(self);
         });
      });
   },

   setLed: function (led) {
      this.led = led;
      this.status = this.led;
      this.markDirty();
   },

   setCounterMeasure: function (counterMeasure) {
      var self = this;
      this.counterMeasure = counterMeasure;

      this.counterMeasure.on("data", function() {
         //console.log("mic: " + this.value);
         self.processEvent(this);
         
      });

      this.markDirty();
   },

   processEvent: function (event) {
      var self = this;
      //Process to activate or deactivate counter measure
   },

   activate: function () {
   },

   deactivate: function () {
   },
});


module.exports.CounterMeasureType = CounterMeasureType;
module.exports.CounterMeasure = CounterMeasure;