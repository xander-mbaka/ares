require('jsclass');
var Class = require('jsclass/src/core').Class;
var DomainObject = require("../data/core/datamapper").DomainObject;
var MapperRegistry = require("../data/core/mapperregistry").MapperRegistry;

var Party = new Class(DomainObject, {

   extend: {

      create:function (name, telephone, otherContact, type, photo) {
         var obj = new this('', name, telephone, otherContact, type, photo, 1);
         obj.markNew();
         return obj;
      },

      createWithId:function (name, telephone, otherContact, type, photo, cb) {
         var self = this;
         MapperRegistry.getMapper(this.newInstance(), function (mapper) {
            self.getNextId(function (id) {
               var obj = new self(id, name, telephone, otherContact, type, photo, 1);
               obj.markNewId();
               cb(obj);
            });
         });         
      }
   },
  
   initialize: function(id, name, telephone, otherContact, type, photo, status) {
      this.id = id;    
      this.name = name;
      this.telephone = telephone;
      this.otherContact = otherContact;
      this.type = type;
      this.photo = photo;
      this.status = status;
   }

});

var PartyLog = new Class(DomainObject, {

   extend: {

      create:function (partyId, action, locationId, notes, timestamp, staffId) {
         var obj = new this('', partyId, action, locationId, notes, timestamp, staffId, 1);
         obj.markNew();
         return obj;
      },

      createWithId:function (partyId, action, locationId, notes, timestamp, staffId, cb) {
         var self = this;
         MapperRegistry.getMapper(this.newInstance(), function (mapper) {
            self.getNextId(function (id) {
               var obj = new self(id, partyId, action, locationId, notes, timestamp, staffId, 1);
               obj.markNewId();
               cb(obj);
            });
         });         
      }
   },
  
   initialize: function(id, partyId, action, locationId, notes, timestamp, staffId, status) {
      this.id = id;    
      this.partyId = partyId;
      this.action = action;
      this.locationId = locationId;
      this.notes = notes;
      this.timestamp = timestamp;
      this.staffId = staffId;
      this.status = status;
   }

});

var Appointment = new Class(DomainObject, {

   extend: {

      create:function (visitorId, staffId, office, scheduledStamp, arrivalStamp) {
         var obj = new this('', visitorId, staffId, office, scheduledStamp, arrivalStamp, 1);
         obj.markNew();
         return obj;
      },

      createWithId:function (visitorId, staffId, office, scheduledStamp, arrivalStamp, cb) {
         var self = this;
         MapperRegistry.getMapper(this.newInstance(), function (mapper) {
            self.getNextId(function (id) {
               var obj = new self(id, visitorId, staffId, office, scheduledStamp, arrivalStamp, 1);
               obj.markNewId();
               cb(obj);
            });
         });         
      }
   },
  
   initialize: function(id, visitorId, staffId, office, scheduledStamp, arrivalStamp, status) {
      this.id = id;    
      this.visitorId = visitorId;
      this.staffId = staffId;
      this.office = office;
      this.scheduledStamp = scheduledStamp;
      this.arrivalStamp = arrivalStamp;
      this.status = status;
   }

});

var Message = new Class(DomainObject, {

   extend: {

      create:function (from, to, type, title, body, sentStamp, priority) {
         var obj = new this('', from, to, type, title, body, sentStamp, '', priority, 1);
         obj.markNew();
         return obj;
      },

      createWithId:function (from, to, type, title, body, sentStamp, priority, cb) {
         var self = this;
         MapperRegistry.getMapper(this.newInstance(), function (mapper) {
            self.getNextId(function (id) {
               var obj = new self(id, from, to, type, title, body, sentStamp, '', priority, 1);
               obj.markNewId();
               cb(obj);
            });
         });         
      }
   },
  
   initialize: function(id, from, to, type, title, body, sentStamp, viewedStamp, priority, status) {
      this.id = id;    
      this.from = from;
      this.to = to;
      this.type = type;
      this.title = title;
      this.body = body;
      this.sentStamp = sentStamp;
      this.viewedStamp = viewedStamp;
      this.status = status;
   }

});

module.exports.Party = Party;
module.exports.PartyLog = PartyLog;
module.exports.Appointment = Appointment;
module.exports.Message = Message;