require('jsclass');
var Class = require('jsclass/src/core').Class;
var Console = require('jsclass/src/console').Console;
var AbstractMapper = require("./core/datamapper").AbstractMapper;
var DataMap = require("./core/datamapper").DataMap;

var LocationMapper = new Class(AbstractMapper, {
  
   initialize: function() {
      this.callSuper();
   },

   loadDataMap: function (object) {
      this.domainClass = object.klass;
      this.dataMap = new DataMap(this.domainClass, 'locations');
      this.dataMap.addColumnMap('name', 'name', 'varchar', 255);
      this.dataMap.addColumnMap('latitude', 'latitude', 'varchar', 255);
      this.dataMap.addColumnMap('longitude', 'longitude', 'varchar', 255);
      this.dataMap.addColumnMap('description', 'description', 'varchar', 255);
      this.dataMap.addColumnMap('status', 'status', 'tinyint', 2);
      this.dataMap.addColumnMap('multiplier', 'multiplier', 'int', 3);
      this.mapLoaded = true;
   },

   findWhereNeighbourStatement: function(){
      //return 'SELECT * FROM '+this.dataMap.tableName+' WHERE module_id = '+ moduleId +' AND status = 1 ORDER BY pos ASC';
   }

});

var SensorTypeMapper = new Class(AbstractMapper, {
  
   initialize: function() {
      this.callSuper();
   },

   loadDataMap: function (object) {
      this.domainClass = object.klass;
      this.dataMap = new DataMap(this.domainClass, 'sensor_types');
      this.dataMap.addColumnMap('name', 'name', 'varchar', 255);
      this.dataMap.addColumnMap('description', 'description', 'varchar', 255);
      this.dataMap.addColumnMap('logo', 'logo', 'varchar', 255);
      this.dataMap.addColumnMap('space', 'space', 'varchar', 255);
      this.dataMap.addColumnMap('unit', 'unit', 'varchar', 255);
      this.mapLoaded = true;
   },

   findWhereNameStatement: function(name){
      return 'SELECT * FROM '+this.dataMap.tableName+' WHERE name LIKE "%'+ name +'%" = '+ moduleId +' LIMIT 0,1';
   }

});

var SensorMapper = new Class(AbstractMapper, {
  
   initialize: function() {
      this.callSuper();
   },

   loadDataMap: function (object) {
      this.domainClass = object.klass;
      this.dataMap = new DataMap(this.domainClass, 'sensors');
      this.dataMap.addColumnMap('name', 'name', 'varchar', 255);
      this.dataMap.addColumnMap('serial', 'deviceId', 'varchar', 255);
      this.dataMap.addColumnMap('type', 'typeId', 'int', 11);
      this.dataMap.addColumnMap('location_id', 'locationId', 'int', 11);
       this.dataMap.addColumnMap('pin_id', 'pinId', 'varchar', 5);
      this.dataMap.addColumnMap('status', 'status', 'tinyint', 2);
      this.mapLoaded = true;
   },

   findWhereNeighbourStatement: function(){
      //return 'SELECT * FROM '+this.dataMap.tableName+' WHERE module_id = '+ moduleId +' AND status = 1 ORDER BY pos ASC';
   }

});

var EventTypeMapper = new Class(AbstractMapper, {
  
   initialize: function() {
      this.callSuper();
   },

   loadDataMap: function (object) {
      this.domainClass = object.klass;
      this.dataMap = new DataMap(this.domainClass, 'event_types');
      this.dataMap.addColumnMap('name', 'name', 'varchar', 255);
      this.dataMap.addColumnMap('location_id', 'locationId', 'int', 11);
      this.dataMap.addColumnMap('sensor_type_id', 'sensoTypeId', 'int', 11);
      this.dataMap.addColumnMap('lower', 'lower', 'int', 11);
      this.dataMap.addColumnMap('upper', 'upper', 'int', 11);
      this.dataMap.addColumnMap('weight', 'weight', 'tinyint', 2);
      this.dataMap.addColumnMap('assumption', 'assumption', 'varchar', 255);
      this.mapLoaded = true;
   },

   findWhereNameStatement: function(name){
      return 'SELECT * FROM '+this.dataMap.tableName+' WHERE name LIKE "%'+ name +'%" = '+ moduleId +' LIMIT 0,1';
   }

});

var CounterMeasureTypeMapper = new Class(AbstractMapper, {
  
   initialize: function() {
      this.callSuper();
   },

   loadDataMap: function (object) {
      this.domainClass = object.klass;
      this.dataMap = new DataMap(this.domainClass, 'counter_measure_types');
      this.dataMap.addColumnMap('name', 'name', 'varchar', 255);
      this.dataMap.addColumnMap('type', 'type', 'varchar', 255);
      this.dataMap.addColumnMap('category', 'category', 'varchar', 255);
      this.dataMap.addColumnMap('logo', 'logo', 'varchar', 255);
      this.dataMap.addColumnMap('description', 'description', 'varchar', 255);
      this.mapLoaded = true;
   },

   findWhereNameStatement: function(name){
      return 'SELECT * FROM '+this.dataMap.tableName+' WHERE name LIKE "%'+ name +'%" = '+ moduleId +' LIMIT 0,1';
   }

});

var CounterMeasureMapper = new Class(AbstractMapper, {
  
   initialize: function() {
      this.callSuper();
   },

   loadDataMap: function (object) {
      this.domainClass = object.klass;
      this.dataMap = new DataMap(this.domainClass, 'counter_measures');
      this.dataMap.addColumnMap('name', 'name', 'varchar', 255);
      this.dataMap.addColumnMap('type_id', 'typeId', 'int', 11);
      this.dataMap.addColumnMap('device_id', 'deviceId', 'varchar', 255);
      this.dataMap.addColumnMap('region', 'region', 'varchar', 255);
      this.dataMap.addColumnMap('status', 'status', 'tinyint', 2);
      this.mapLoaded = true;
   },

   findWhereNeighbourStatement: function(){
      //return 'SELECT * FROM '+this.dataMap.tableName+' WHERE module_id = '+ moduleId +' AND status = 1 ORDER BY pos ASC';
   }

});

var ComplexEventMapper = new Class(AbstractMapper, {
  
   initialize: function() {
      this.callSuper();
   },

   loadDataMap: function (object) {
      this.domainClass = object.klass;
      this.dataMap = new DataMap(this.domainClass, 'complex_types');
      this.dataMap.addColumnMap('name', 'name', 'varchar', 255);
      this.dataMap.addColumnMap('locations', 'region', 'varchar', 255);
      this.dataMap.addColumnMap('event_types', 'eventIds', 'varchar', 255);
      this.dataMap.addColumnMap('window', 'period', 'int', 11);
      this.dataMap.addColumnMap('counter_measures', 'counterIds', 'varchar', 255);
      this.dataMap.addColumnMap('status', 'status', 'tinyint', 2);
      this.mapLoaded = true;
   },

   findWhereNeighbourStatement: function(){
      //return 'SELECT * FROM '+this.dataMap.tableName+' WHERE module_id = '+ moduleId +' AND status = 1 ORDER BY pos ASC';
   }

});

var SecurityLogMapper = new Class(AbstractMapper, {
  
   initialize: function() {
      this.callSuper();
   },

   loadDataMap: function (object) {
      this.domainClass = object.klass;
      this.dataMap = new DataMap(this.domainClass, 'security_event_log');
      this.dataMap.addColumnMap('event_id', 'event_id', 'int', 11);
      this.dataMap.addColumnMap('category', 'category', 'varchar', 255);
      this.dataMap.addColumnMap('threat_level', 'threatLevel', 'tinyint', 2);
      this.dataMap.addColumnMap('start_stamp', 'startStamp', 'bigint', 25);
      this.dataMap.addColumnMap('end_stamp', 'endStamp', 'bigint', 25);
      this.dataMap.addColumnMap('log_ids', 'logIds', 'varchar', 255);
      this.dataMap.addColumnMap('media', 'media', 'varchar', 255);
      this.dataMap.addColumnMap('notes', 'notes', 'text', 0);
      this.dataMap.addColumnMap('status', 'status', 'tinyint', 2);
      this.mapLoaded = true;
   },

   findWhereNeighbourStatement: function(){
      //return 'SELECT * FROM '+this.dataMap.tableName+' WHERE module_id = '+ moduleId +' AND status = 1 ORDER BY pos ASC';
   }

});

var PartyMapper = new Class(AbstractMapper, {
  
   initialize: function() {
      this.callSuper();
   },

   loadDataMap: function (object) {
      this.domainClass = object.klass;
      this.dataMap = new DataMap(this.domainClass, 'parties');
      this.dataMap.addColumnMap('name', 'name', 'varchar', 255);
      this.dataMap.addColumnMap('telephone', 'telephone', 'varchar', 255);
      this.dataMap.addColumnMap('secondary_contact', 'otherContact', 'varchar', 255);
      this.dataMap.addColumnMap('type', 'type', 'varchar', 255);
      this.dataMap.addColumnMap('photo', 'photo', 'varchar', 255);
      this.dataMap.addColumnMap('status', 'status', 'tinyint', 2);
      this.mapLoaded = true;
   },

   findWhereNeighbourStatement: function(){
      //return 'SELECT * FROM '+this.dataMap.tableName+' WHERE module_id = '+ moduleId +' AND status = 1 ORDER BY pos ASC';
   }

});

var PartyLogMapper = new Class(AbstractMapper, {
  
   initialize: function() {
      this.callSuper();
   },

   loadDataMap: function (object) {
      this.domainClass = object.klass;
      this.dataMap = new DataMap(this.domainClass, 'party_logs');
      this.dataMap.addColumnMap('party_id', 'partyId', 'int', 11);
      this.dataMap.addColumnMap('action', 'action', 'varchar', 255);
      this.dataMap.addColumnMap('location_id', 'locationId', 'int', 11);
      this.dataMap.addColumnMap('notes', 'notes', 'text', 0);
      this.dataMap.addColumnMap('timestamp', 'timestamp', 'bigint', 25);
      this.dataMap.addColumnMap('staff_id', 'staffId', 'int', 11);
      this.dataMap.addColumnMap('status', 'status', 'tinyint', 2);
      this.mapLoaded = true;
   },

   findWhereNeighbourStatement: function(){
      //return 'SELECT * FROM '+this.dataMap.tableName+' WHERE module_id = '+ moduleId +' AND status = 1 ORDER BY pos ASC';
   }

});

var AppointmentMapper = new Class(AbstractMapper, {
  
   initialize: function() {
      this.callSuper();
   },

   loadDataMap: function (object) {
      this.domainClass = object.klass;
      this.dataMap = new DataMap(this.domainClass, 'appointments');
      this.dataMap.addColumnMap('visitor_id', 'visitorId', 'int', 11);
      this.dataMap.addColumnMap('staff_id', 'staffId', 'int', 11);
      this.dataMap.addColumnMap('office', 'office', 'varchar', 255);
      this.dataMap.addColumnMap('scheduled_stamp', 'scheduledStamp', 'bigint', 25);
      this.dataMap.addColumnMap('arrival_stamp', 'arrivalStamp', 'bigint', 25);
      this.dataMap.addColumnMap('status', 'status', 'tinyint', 2);
      this.mapLoaded = true;
   },

   findWhereNeighbourStatement: function(){
      //return 'SELECT * FROM '+this.dataMap.tableName+' WHERE module_id = '+ moduleId +' AND status = 1 ORDER BY pos ASC';
   }

});

var MessageMapper = new Class(AbstractMapper, {
  
   initialize: function() {
      this.callSuper();
   },

   loadDataMap: function (object) {
      this.domainClass = object.klass;
      this.dataMap = new DataMap(this.domainClass, 'messages');
      this.dataMap.addColumnMap('from', 'from', 'int', 11);
      this.dataMap.addColumnMap('to', 'to', 'int', 11);
      this.dataMap.addColumnMap('type', 'type', 'varchar', 255);
      this.dataMap.addColumnMap('title', 'title', 'varchar', 255);
      this.dataMap.addColumnMap('body', 'body', 'text', 0);
      this.dataMap.addColumnMap('sent_stamp', 'sentStamp', 'bigint', 25);
      this.dataMap.addColumnMap('viewed_stamp', 'viewedStamp', 'bigint', 25);
      this.dataMap.addColumnMap('priority', 'priority', 'int', 11);
      this.dataMap.addColumnMap('status', 'status', 'tinyint', 2);
      this.mapLoaded = true;
   },

   findWhereNeighbourStatement: function(){
      //return 'SELECT * FROM '+this.dataMap.tableName+' WHERE module_id = '+ moduleId +' AND status = 1 ORDER BY pos ASC';
   }

});

module.exports.LocationMapper = LocationMapper;
module.exports.SensorTypeMapper = SensorTypeMapper;
module.exports.SensorMapper = SensorMapper;
module.exports.EventTypeMapper = EventTypeMapper;
module.exports.ComplexEventMapper = ComplexEventMapper;
module.exports.SecurityLogMapper = SecurityLogMapper;
module.exports.CounterMeasureTypeMapper = CounterMeasureTypeMapper;
module.exports.CounterMeasureMapper = CounterMeasureMapper;
module.exports.PartyMapper = PartyMapper;
module.exports.PartyLogMapper = PartyLogMapper;
module.exports.AppointmentMapper = AppointmentMapper;
module.exports.MessageMapper = MessageMapper;