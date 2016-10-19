require('jsclass');
var Class = require('jsclass/src/core').Class;
var Console = require('jsclass/src/console').Console;
var Hash = require('jsclass/src/hash').Hash;
var Set = require('jsclass/src/set').Set;
var Observable = require('jsclass/src/observable').Observable;
var DomainObject = require("../data/core/datamapper").DomainObject;
var MapperRegistry = require("../data/core/mapperregistry").MapperRegistry;
var Location = require("../domain/location").Location;
var SensorType = require("../domain/sensors").SensorType;
var Sensor = require("../domain/sensors").Sensor;
var Crypto = require('crypto');
var five = require("johnny-five");

var SensorType = new Class(DomainObject, {

   extend: {

      create:function (name, description, logo, space, unit) {
         var obj = new this('', name, description, logo, space, unit);
         obj.markNew();
         return obj;
      },

      createWithId:function (name, description, logo, space, unit, cb) {
         var self = this;
         MapperRegistry.getMapper(this.newInstance(), function (mapper) {
            self.getNextId(function (id) {
               var obj = new self(id, name, description, logo, space, unit);
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

   initialize: function (id, name, description, logo, space, unit) {
      this.id = id;
      this.name  = name;
      this.description = description;
      this.logo = logo;
      this.space = space;
      this.unit = unit;
   }

});

var Sensor = new Class(DomainObject, {

   include: Observable,

   extend: {

      create:function (name, serial, locationId) {
         var obj = new this('', name, serial, locationId, 1);
         obj.markNew();
         return obj;
      },

      createWithId:function (name, serial, locationId, cb) {
         var self = this;
         MapperRegistry.getMapper(this.newInstance(), function (mapper) {
            self.getNextId(function (id) {
               var obj = new self(id, name, serial, locationId, 1);
               obj.markNewId();
               cb(obj);
            });
         });         
      }
   },

   initialize: function (id, typeId, device_id, locationId, pinId, status) {
      this.id = id;
      //this.type  = type;
      this.typeId = typeId;
      this.deviceId = device_id;
      // this.location = location;
      this.locationId = locationId;
      this.referenceAverage = 0;
      this.referenceHistory = [];
      this.immediateAverage = 0;
      this.immediateHistory = [];
      this.count = 0;
      this.immediateTotal = 0;
      this.referenceTotal = 0;
      this.pinId = pinId;
      this.status = status;
      //location.registerSensor(this);
   },

   loadObjects: function (led) {
      var self = this;
      if (locationId != null) {
         Location.findObject(locationId, function (loc) {
           //loc.eventManager.registerSensor(self);
         });
      }
      
      if (typeId != null) {
         SensorType.findObject(typeId, function (typ) {
           self.type = typ;
         });
      }
   },

   loadSensor: function () {
      var motion = new five.Motion(7);
  var proximity = new five.Proximity({controller: "HCSR04", pin: 6});
  var vibration = new five.Sensor("A1");
  var weight = new five.Sensor({ pin: "A4", freq: 1000, threshold: 5 });
   },

   setLed: function (led) {
      this.led = led;
      this.status = this.led;
      this.markDirty();
   },

   setSensor: function (sensor, pin) {
      var self = this;
      this.sensor = sensor;
      this.pinId = pin;

      this.sensor.on("data", function() {
         //console.log("mic: " + this.value);
         self.processEvent(this);
         //self.type.processEvent(this, self);
         
      });

      this.markDirty();
   },

   processEvent: function (event) {
      var self = this;
      this.immediateHistory.push(event.value);
      this.immediateTotal += event.value;

      if (this.immediateHistory.length == 200) {
         this.immediateAverage = this.immediateTotal/200;
         console.log(new Date(Date.now()) + " " + self.type.name +": " + this.immediateAverage);
         self.led.brightness(this.immediateAverage >> 2);
         this.immediateHistory = [];
         this.immediateTotal = 0;
         this.archiveAverage(new Date(Date.now()), this.immediateAverage);
         this.notifyObservers(this, event);
      }
   },

   archiveAverage: function (date, value) {
      var self = this;
      var c = this.referenceHistory.push(Array(date, value));
      this.referenceTotal += value;

      if (this.referenceHistory.length >= 60) {
         var p = this.referenceHistory.pop();
         this.referenceTotal -= p[1];
         --c;
         this.referenceAverage = this.referenceTotal/c;
         //console.log("mic: " + this.referenceAverage);
         //self.led.brightness(this.referenceAverage >> 2);
         //this.referenceHistory = [];
      }


   },


   newEvent: function (timestamp, value) {
      // body...
   },

   refreshImmediateHistory: function (argument) {
      // refreshReferenceHistory(event)
   },

   refreshReferenceHistory: function (argument) {
      // body...
   },

   getImmediateAverage: function (argument) {
      // body...
   }
});

var EventType = new Class(DomainObject, {

   extend: {

      create:function (name, locationId, sensorTypeId, value, weight, assumption) {
         var obj = new this('', name, locationId, sensorTypeId, value, weight, assumption);
         obj.markNew();
         return obj;
      },

      createWithId:function (name, locationId, sensorTypeId, value, weight, assumption, cb) {
         var self = this;
         MapperRegistry.getMapper(this.newInstance(), function (mapper) {
            self.getNextId(function (id) {
               var obj = new self(id, name, locationId, sensorTypeId, value, weight, assumption);
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

   initialize: function (id, name, locationId, sensorTypeId, value, weight, assumption) {
      this.id = id;
      this.name  = name;
      this.locationId = locationId;
      this.sensorTypeId = sensorTypeId;
      this.value = value;
      this.weight = weight;
      this.assumption = assumption;
   }

});

//Later abstract all sensors into one and have a processing strategy recognition method for the different kinds of sensors

/*var AudioSensor = new Class(SensorType, {

   initialize: function (id, name, serial, location) {

      this.klass.findByTypeName('Audio Sensor', function (type) {
         this.callSuper(id, type, serial, location);
      });
      
   },

   setSensor: function (sensor) {
      var self = this;
      this.sensor = sensor;

      this.sensor.on("data", function() {
         //console.log("mic: " + this.value);
         self.processEvent(this);
         
      });

      this.markDirty();
   },

   processEvent: function (event) {
      var self = this;
      this.immediateHistory.push(event.value);
      this.immediateTotal += event.value;

      if (this.immediateHistory.length == 200) {
         this.immediateAverage = this.immediateTotal/200;
         console.log(new Date(Date.now()) + " mic: " + this.immediateAverage);
         self.led.brightness(this.immediateAverage >> 2);
         this.immediateHistory = [];
         this.immediateTotal = 0;
         this.archiveAverage(new Date(Date.now()), this.immediateAverage);
         this.notifyObservers(this, event);
      }
   },

   archiveAverage: function (date, value) {
      var self = this;
      var c = this.referenceHistory.push(Array(date, value));
      this.referenceTotal += value;

      if (this.referenceHistory.length >= 60) {
         var p = this.referenceHistory.pop();
         this.referenceTotal -= p[1];
         --c;
         this.referenceAverage = this.referenceTotal/c;
         //console.log("mic: " + this.referenceAverage);
         //self.led.brightness(this.referenceAverage >> 2);
         //this.referenceHistory = [];
      }


   }

});

var VibrationSensor = new Class(SensorType, {

   initialize: function (id, name, serial, location) {
      this.klass.findByTypeName('Vibration Sensor', function (type) {
         this.callSuper(id, type, serial, location);
      });
   },

   

   processEvent: function (event) {
      var self = this;
      this.immediateHistory.push(event.value);
      this.immediateTotal += event.value;

      if (this.immediateHistory.length == 200) {
         this.immediateAverage = this.immediateTotal/200;
         console.log(new Date(Date.now()) + " mic: " + this.immediateAverage);
         self.led.brightness(this.immediateAverage >> 2);
         this.immediateHistory = [];
         this.immediateTotal = 0;
         this.archiveAverage(new Date(Date.now()), this.immediateAverage);
         this.notifyObservers(this, event);
      }
   },

   archiveAverage: function (date, value) {
      var self = this;
      var c = this.referenceHistory.push(Array(date, value));
      this.referenceTotal += value;

      if (this.referenceHistory.length >= 60) {
         var p = this.referenceHistory.pop();
         this.referenceTotal -= p[1];
         --c;
         this.referenceAverage = this.referenceTotal/c;
         //console.log("mic: " + this.referenceAverage);
         //self.led.brightness(this.referenceAverage >> 2);
         //this.referenceHistory = [];
      }


   }

});

var MotionSensor = new Class(SensorType, {

   initialize: function (id, name, serial, location) {
      this.klass.findByTypeName('Motion Sensor', function (type) {
         this.callSuper(id, type, serial, location);
      });
   },

   setSensor: function (sensor) {
      var self = this;
      this.sensor = sensor;

      this.sensor.on("data", function() {
         //console.log("mic: " + this.value);
         self.processEvent(this);
         
      });

      this.markDirty();
   },

   processEvent: function (event) {
      var self = this;
      this.immediateHistory.push(event.value);
      this.immediateTotal += event.value;

      if (this.immediateHistory.length == 200) {
         this.immediateAverage = this.immediateTotal/200;
         console.log(new Date(Date.now()) + " mic: " + this.immediateAverage);
         self.led.brightness(this.immediateAverage >> 2);
         this.immediateHistory = [];
         this.immediateTotal = 0;
         this.archiveAverage(new Date(Date.now()), this.immediateAverage);
         this.notifyObservers(this, event);
      }
   },

   archiveAverage: function (date, value) {
      var self = this;
      var c = this.referenceHistory.push(Array(date, value));
      this.referenceTotal += value;

      if (this.referenceHistory.length >= 60) {
         var p = this.referenceHistory.pop();
         this.referenceTotal -= p[1];
         --c;
         this.referenceAverage = this.referenceTotal/c;
         //console.log("mic: " + this.referenceAverage);
         //self.led.brightness(this.referenceAverage >> 2);
         //this.referenceHistory = [];
      }


   }

});

var ProximitySensor = new Class(SensorType, {

   initialize: function (id, name, serial, location) {
      this.klass.findByTypeName('Proximity Sensor', function (type) {
         this.callSuper(id, type, serial, location);
      });
   },

   setSensor: function (sensor) {
      var self = this;
      this.sensor = sensor;

      this.sensor.on("data", function() {
         //console.log("mic: " + this.value);
         self.processEvent(this);
         
      });

      this.markDirty();
   },

   processEvent: function (event) {
      var self = this;
      this.immediateHistory.push(event.value);
      this.immediateTotal += event.value;

      if (this.immediateHistory.length == 200) {
         this.immediateAverage = this.immediateTotal/200;
         console.log(new Date(Date.now()) + " mic: " + this.immediateAverage);
         self.led.brightness(this.immediateAverage >> 2);
         this.immediateHistory = [];
         this.immediateTotal = 0;
         this.archiveAverage(new Date(Date.now()), this.immediateAverage);
         this.notifyObservers(this, event);
      }
   },

   archiveAverage: function (date, value) {
      var self = this;
      var c = this.referenceHistory.push(Array(date, value));
      this.referenceTotal += value;

      if (this.referenceHistory.length >= 60) {
         var p = this.referenceHistory.pop();
         this.referenceTotal -= p[1];
         --c;
         this.referenceAverage = this.referenceTotal/c;
         //console.log("mic: " + this.referenceAverage);
         //self.led.brightness(this.referenceAverage >> 2);
         //this.referenceHistory = [];
      }


   }

});

var WeightSensor = new Class(SensorType, {

   initialize: function (id, name, serial, location) {
      this.klass.findByTypeName('Weight Sensor', function (type) {
         this.callSuper(id, type, serial, location);
      });
   },

   setSensor: function (sensor) {
      var self = this;
      this.sensor = sensor;

      this.sensor.on("data", function() {
         //console.log("mic: " + this.value);
         self.processEvent(this);
         
      });

      this.markDirty();
   },

   processEvent: function (event) {
      var self = this;
      this.immediateHistory.push(event.value);
      this.immediateTotal += event.value;

      if (this.immediateHistory.length == 200) {
         this.immediateAverage = this.immediateTotal/200;
         console.log(new Date(Date.now()) + " mic: " + this.immediateAverage);
         self.led.brightness(this.immediateAverage >> 2);
         this.immediateHistory = [];
         this.immediateTotal = 0;
         this.archiveAverage(new Date(Date.now()), this.immediateAverage);
         //this.assignProbability
         this.notifyObservers(this, event);
      }
   },

   archiveAverage: function (date, value) {
      var self = this;
      var c = this.referenceHistory.push(Array(date, value));
      this.referenceTotal += value;

      if (this.referenceHistory.length >= 60) {
         var p = this.referenceHistory.shift();
         this.referenceTotal -= p[1];
         --c;
         this.referenceAverage = this.referenceTotal/c;
         //console.log("mic: " + this.referenceAverage);
         //self.led.brightness(this.referenceAverage >> 2);
         //this.referenceHistory = [];
      }


   }

});*/
module.exports.SensorType = SensorType;
module.exports.Sensor = Sensor;
module.exports.EventType = EventType;
//module.exports.AudioSensor = AudioSensor;
//module.exports.VibrationSensor = VibrationSensor;
//module.exports.MotionSensor = MotionSensor;
//module.exports.ProximitySensor = ProximitySensor;
//module.exports.WeightSensor = WeightSensor;