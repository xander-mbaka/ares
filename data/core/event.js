
Skip to content
This repository

    Pull requests
    Issues
    Gist

    @xander-mbaka

1
0

    0

xander-mbaka/ares
Code
Issues 0
Pull requests 0
Projects 1
Wiki
Pulse
Graphs
Settings
ares/domain/core/event?.js
1a45c2d on Jul 28
@xander-mbaka xander-mbaka Uploading project as at 28/7/16
175 lines (131 sloc) 4.18 KB
require('jsclass');
JS.require('JS.Class');
JS.require('JS.Hash');
JS.require('JS.Set');

var Hash = require("../database/Hash");
var Uuid = require("node-uuid");

var EventType = new JS.Class({
  
   initialize: function(name) {
      this.name = name;
   }

});

module.exports.EventType = EventType;

var EventStatus = new JS.Class({
  
   initialize: function(name) {
      this.name = name;
   }

});

module.exports.EventStatus = EventStatus;

var Event = new JS.Class({

   initialize: function(name, eventType) {
      this.eventId = Uuid.v4();
      this.name = name;
      this.type = eventType;
      this.eventLog = new JS.Hash();
   },

   timestamp: function(){
      return this.timestamp;
   },

   type: function(){
      return this.type;
   }

});

module.exports.Event = Event;

var Location = new JS.Class({
  
   initialize: function(name) {
      this.name = name;
   }

});

module.exports.Location = Location;


var Action = new JS.Class(Event, {

   initialize: function(name, actionType) {
      this.callSuper(name, actionType);
      this.allowedEventTypes = new JS.Set();
      this.participants = new JS.Set();
   },

   schedule: function(starttimestamp, endtimestamp, location){
      this.status = new EventStatus('Scheduled');
      this.eventLog.put(new Date(), new EventStatus('Scheduled'));
      this.scheduledstart = starttimestamp;
      this.scheduledend = endtimestamp;
      this.location = new Location('location')
   },

   start: function(timestamp){
      this.status = new EventStatus('Executing');
      this.eventLog.put(timestamp, new EventStatus('Started'));
      this.timestamp = timestamp;
      this.startedtimestamp = timestamp;
   },

   suspend: function(timestamp){
      this.status = new EventStatus('Suspended');
      this.eventLog.put(timestamp, new EventStatus('Suspended'));
      this.timestamp = timestamp;
   },

   wait: function(timestamp){
      this.status = new EventStatus('Waiting');
      this.eventLog.put(timestamp, new EventStatus('Waiting'));
      this.timestamp = timestamp;
      //set alrm in calendar/schedule and add to parties waiting and due lists
   },

   resume: function(timestamp){
      this.status = new EventStatus('Executing');
      this.eventLog.put(timestamp, new EventStatus('Resumed'));
      this.timestamp = timestamp;
      this.resumedtimestamp = timestamp;
   },

   complete: function(timestamp){
      this.status = new EventStatus('Completed');
      this.eventLog.put(timestamp, new EventStatus('Completed'));
      this.timestamp = timestamp;
      this.completedtimestamp = timestamp;
   },

   abandon: function(timestamp){
      this.status = new EventStatus('Abandoned');
      this.eventLog.put(timestamp, new EventStatus('Abandoned'));
      this.timestamp = timestamp;
      this.abandonedtimestamp = timestamp;
   },

   cancel: function(timestamp){
      this.status = new EventStatus('Cancelled');
      this.eventLog.put(timestamp, new EventStatus('Cancelled'));
      this.timestamp = timestamp;
      this.abandonedtimestamp = timestamp;
   },

   addPerformer: function(party){
      //role == party type
      this.performers.add(party);
   },

   addPerformers: function(partys){
      this.performers.merge(partys);
   },

   getPerformers: function(){
      return this.performers;
   },

   removePerformer: function(party){
      //role == party type
      this.performers.remove(party);
   },

   removePerformers: function(partys){
      this.performers = this.performers.difference(partys);
   },

});

module.exports.Action = Action;

var DomainConcept = new JS.Class({

   initialize: function(name, concept) {
      this.name = name; // e.g leadership, salesmanship, analysis
      this.allowedEventTypes = new JS.Set();
      this.concept = concept;
   },

   initialize: function(name, concept, eventTypes) {
      this.name = name; // e.g leadership, salesmanship, analysis
      this.allowedEventTypes = new JS.Set(eventTypes);
      this.concept = concept;
   },

   addEventType: function(eventType){
      this.allowedEventTypes.add(eventType);
   },

   isValid: function(parent, child){
      return (parent.type == this.allowedParent && child.type == this.allowedChild);
   }

});

module.exports.DomainConcept = DomainConcept;


