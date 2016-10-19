require('jsclass');
var Class = require('jsclass/src/core').Class;
var Console = require('jsclass/src/console').Console;
var AbstractMapper = require("../data/core/datamapper").AbstractMapper;
var DataMap = require("../data/core/datamapper").DataMap;
var Domain = require("../data/core/datamapper").DomainObject;
var MapperRegistry = require("../data/core/mapperregistry").MapperRegistry;
var UoW = require("../data/core/unitofwork").UnitOfWork;
var DomainObject = require("../data/core/datamapper").DomainObject;
var Party = require("./core/party").Party;
var Action = require("./actionfoundry").Action;
var ProposedAction = require("./actionfoundry").ProposedAction;


var ObservationMapper = new Class(AbstractMapper, {
  
   initialize: function() {
      this.callSuper();
   },

   loadDataMap: function (object) {
      this.domainClass = object.klass;
      this.dataMap = new DataMap(this.domainClass, 'observations_and_measurements');
      this.dataMap.addColumnMap('type', 'type', 'varchar');
      this.dataMap.addColumnMap('party_id', 'patientId', 'int');
      this.dataMap.addColumnMap('service_id', 'serviceId', 'varchar');
      this.dataMap.addColumnMap('department', 'department', 'varchar');
      this.dataMap.addColumnMap('context', 'context', 'varchar');
      this.dataMap.addColumnMap('phenomenon', 'phenomenon', 'varchar');
      this.dataMap.addColumnMap('phenomenonType', 'phenomenonType', 'varchar');
      this.dataMap.addColumnMap('date_applicable', 'dateApplicable', 'varchar');
      this.dataMap.addColumnMap('date_recorded', 'dateRecorded', 'varchar');
      this.dataMap.addColumnMap('recorded_stamp', 'recordedStamp', 'bigint');
      this.dataMap.addColumnMap('applicable_stamp', 'applicableStamp', 'bigint');
      this.mapLoaded = true;
   },

   findPatientHXStatement: function(patientId){
      return 'SELECT * FROM '+this.dataMap.tableName+' WHERE (context = "Medical-Surgical HX" OR context = "Family HX" OR context = "Socio-Economic HX" OR context = "Risk Factors") AND party_id = '+ patientId;
   }

});

var DateClass = new Class({
   initialize: function (jsdate) {
      this.jsdate = jsdate;
      this.year = jsdate.getFullYear()
      this.month = this.pad(jsdate.getMonth() + 1)
      this.date = this.pad(jsdate.getDate())
      this.hours = this.pad(jsdate.getHours())
      this.minutes = this.pad(jsdate.getMinutes())
      this.seconds = this.pad(jsdate.getSeconds())
   },

   getDisplayDate: function () {
      return this.date+'/'+this.month+'/'+this.year;
   },

   getTimeStamp: function () {
      var a = this.year+''+this.month+''+this.date+''+this.hours+''+this.minutes+''+this.seconds;
      return parseInt(a, 10);
   },

   pad: function (n) {
      return ("0" + n).slice(-2);
   }
})

var Observation = new Class(Action, {

   extend: {
      newInstance:function () {
         return new this('', '');
      },

      create:function (patient, phenomenon, dateApplicable) {
         var obj = new this('', patient, phenomenon, dateApplicable, new Date(Date.now()));
         obj.markNew();
         //Include logic for data integrity and duplicates 
         return obj;
      },

      createWithId:function (patient, phenomenon, dateApplicable, cb) {
         var self = this;
         self.getNextId(function (id) {
            var dateRecorded = (new Date()).getTime();

            var obj = new self(id, patient, phenomenon, dateApplicable);
            obj.markNewId();
            //obj.setAddress(address);
            //Include logic for data integrity and duplicates 
            cb(obj);
         })
      },

      recordHistory:function (patient, context, phenomenonType, phenomenon, dateApplicable, cb) {
         this.createWithId(patient, phenomenon, dateApplicable, function (obj) {
            obj.setPhenomenonType(phenomenonType);
            obj.setContext(context);
            obj.setDepartment('Records');
            obj.serviceId = obj.eventId;
            cb(obj);
         })
      },

      getHistory:function (patientId, cb) {
         MapperRegistry.getMapper(this.newInstance(), function (mapper) {
            //console.log(mapper.findPatientHXStatement(patientId));
            mapper.findWhere(mapper.findPatientHXStatement(patientId), function (results) {
               cb(results);
            });
         })
      }
   },
  
   initialize: function(id, patient, phenomenon, dateApplicable) {
      this.callSuper('', 'Observation')
      this.id = id;
      this.patientId = patient.id;
      this.patient = patient;
      this.phenomenon = phenomenon;
      var dr = new DateClass(new Date(Date.now()));
      this.dateRecorded = dr.getDisplayDate();
      this.recordedStamp = dr.getTimeStamp();
      //dateApplicable  = typeof dateApplicable  !== 'undefined' ? dateApplicable : true;
      if (typeof dateApplicable  !== 'undefined') {
         this.dateApplicable = dateApplicable;
         var dt = dateApplicable.split(' - ');
         dt = dt[0].split('/');
         this.applicableStamp = parseInt(dt[2]+''+dt[1]+''+dt[0]+'0000', 10);
      } else {
         this.dateApplicable = this.dateRecorded;
         this.applicableStamp = this.recordedStamp;
      }
   },

   setPhenomenonType: function (type) {
      this.phenomenonType = type;
   },

   setContext: function (context) {
      this.context = context;
   },

   setDepartment: function (department) {
      this.department = department;
   }

});

var MeasurementMapper = new Class(AbstractMapper, {
  
   initialize: function() {
      this.callSuper();
   },

   loadDataMap: function (object) {
      this.domainClass = object.klass;
      this.dataMap = new DataMap(this.domainClass, 'observations_and_measurements');
      this.dataMap.addColumnMap('type', 'type', 'varchar');
      this.dataMap.addColumnMap('party_id', 'patientId', 'int');
      this.dataMap.addColumnMap('service_id', 'serviceId', 'int');
      this.dataMap.addColumnMap('department', 'department', 'varchar');
      this.dataMap.addColumnMap('context', 'context', 'varchar');
      this.dataMap.addColumnMap('phenomenonType', 'phenomenonType', 'varchar');
      this.dataMap.addColumnMap('quantity', 'quantity', 'float');
      this.dataMap.addColumnMap('date_applicable', 'dateApplicable', 'blob');
      this.dataMap.addColumnMap('date_Recorded', 'dateRecorded', 'blob');
      this.dataMap.addColumnMap('recorded_stamp', 'recordedStamp', 'int');
      this.dataMap.addColumnMap('applicable_stamp', 'applicableStamp', 'int');
      this.mapLoaded = true;
   }

});

var Measurement = new Class(Observation, {

   extend: {
      newInstance:function () {
         return new this('', '');
      },

      create:function (patient, phenomenonType, quantity) {
         var obj = new this('', patient, phenomenonType, quantity, new Date(Date.now()));
         obj.markNew();
         //Include logic for data integrity and duplicates 
         return obj;
      },

      createWithId:function (patient, phenomenonType, quantity, cb) {
         var self = this;
         self.getNextId(function (id) {
            var obj = new self(id, patient, phenomenonType, quantity, new Date(Date.now()));
            obj.markNewId();
            //obj.setAddress(address);
            //Include logic for data integrity and duplicates 
            cb(obj);
         })
      }
   },
  
   initialize: function(id, patient, phenomenonType, quantity, datetime) {
      //this.callSuper('', 'Measurement')
      this.id = id;
      this.type = 'Measurement';    
      this.patientId = patient.id;
      this.patient = patient;
      this.phenomenonType = phenomenonType;
      this.quantity = quantity;
      this.datetime = datetime;
      this.timestamp = Math.round(datetime.getTime()/1000);
   }

});

var PhenomenonType = new Class(DomainObject, {

   extend: {
      newInstance:function () {
         return new this('', '');
      },

      create:function (name) {
         var obj = new this('', name);
         obj.markNew();
         //Include logic for data integrity and duplicates 
         return obj;
      },

      createWithId:function (name, cb) {
         var self = this;
         self.getNextId(function (id) {
            var obj = new self(id, name);
            obj.markNewId();
            //obj.setAddress(address);
            //Include logic for data integrity and duplicates 
            cb(obj);
         })
      }
   },
  
   initialize: function(id, name) {
      this.id = id;
      this.name = name;
   },

   setUnitMeasure: function(unit) {
      this.unit_id = unit.id;
      this.unit = unit;
   }

});

var Phenomenon = new Class(DomainObject, {

   extend: {
      newInstance:function () {
         return new this('', '');
      },

      create:function (name) {
         var obj = new this('', name);
         obj.markNew();
         //Include logic for data integrity and duplicates 
         return obj;
      },

      createWithId:function (name, cb) {
         var self = this;
         self.getNextId(function (id) {
            var obj = new self(id, name);
            obj.markNewId();
            //obj.setAddress(address);
            //Include logic for data integrity and duplicates 
            cb(obj);
         })
      }
   },
  
   initialize: function(id, name) {
      this.id = id;
      this.name = name;
   },

   setType: function(type) {
      this.type = type;
   }

});

module.exports.Observation = Observation;
module.exports.ObservationMapper = ObservationMapper;
module.exports.Measurement = Measurement;
module.exports.MeasurementMapper = MeasurementMapper;
module.exports.PhenomenonType = PhenomenonType;
module.exports.Phenomenon = Phenomenon;










