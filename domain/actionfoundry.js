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
      this.eventLog = new Hash();
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

var Location = new Class({
  
   initialize: function(name) {
      this.name = name;
   },

   setCoordinates: function(latitude, longitude) {
      this.latitude = latitude;
      this.longitude = longitude;
   }

});

module.exports.Location = Location;

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

var ActionReference = new Class({

   initialize: function(proposedactionid) {
      this.actionId = proposedactionid;
      this.actionDependencies = new Hash();
      this.actionConsequences = new Hash();
   },

   addDependency: function(plandependency){
      this.actionDependencies.add(plandependency);
   },

   addConsequence: function(plandependency){
      this.actionConsequences.add(plandependency);
   },

   removeDependency: function(plandependency){
      this.actionDependencies.remove(plandependency);
   },

   removeConsequence: function(plandependency){
      this.actionConsequences.remove(plandependency);
   }

});

module.exports.ActionReference = ActionReference;


var PlanDependency = new Class({

   initialize: function(plan, dependentActionReference, consequentActionReference) {
      this.planId = plan.id;
      this.dependentAction = dependentActionReference;
      this.consequentActions = consequentActionReference;
   },
   //helper functions to modify dependency
   addDependency: function(actionreference){
      this.dependentAction = actionreference;
   },

   addConsequence: function(actionreference){
      this.consequentActions = actionreference;
   },

   removeDependency: function(actionreference){
      this.dependentActions = undefined;
   },

   removeConsequence: function(actionreference){
      this.consequentActions = undefined;
   }

});

module.exports.PlanDependency = PlanDependency;

var ProtocolReference = new Class({

   initialize: function(protocolid) {
      this.protocolId = protocolid;
      this.protocolDependencies = new Hash();
      this.protocolConsequences = new Hash();
   },

   addDependency: function(protocoldependency){
      this.protocolDependencies.add(protocoldependency);
   },

   addConsequence: function(protocoldependency){
      this.protocolConsequences.add(protocoldependency);
   },

   removeDependency: function(protocoldependency){
      this.protocolDependencies.remove(protocoldependency);
   },

   removeConsequence: function(protocoldependency){
      this.protocolConsequences.remove(protocoldependency);
   }

});

module.exports.ProtocolReference = ProtocolReference;

var Action = new Class(Event, {

   include: Observable,

   initialize: function(name, actionType) {
      this.callSuper(name, actionType);
      this.allowedEventTypes = new Set();
      this.allowedPartTypes = new Set();
      this.participants = new Set();
      this.referencedEvents = new Set();
      //this.priority = Priority.normal();
      
   },

   addEventReference: function(event) {
      this.referencedEvents.put(event);
      this.addObserver(event.method('receiveEventNotification'), event);
   },

   modifyPriority: function(priority) {
      if (priority.klass == this.priority.klass) {
         this.priority = priority;
      };
   },

   receiveEventNotification: function(event) {      
      this.referencedEvents.forEach(function(referenced) {
         if (referenced.eventId == event.eventId) {
            this.resume(new Date());
         };
      });    
   },

   notifyReferencedActions: function() {
      this.notifyObservers(this);
   },

   notifyPerformers: function() {
      var Self = this;
      this.participants.forEach(function(party) { 
         //link to party inbox object in database
         //add to the parties inbox, then send notification to party's queue if the priority is high
         //inbox queue is arranged in priorities
         party.addToInbox(this);
      });
   },

   schedule: function(starttimestamp, endtimestamp){
      this.status = new EventStatus('Scheduled');
      this.eventLog.put(new Date(), new EventStatus('Scheduled'));
      this.scheduledstart = starttimestamp;
      this.scheduledend = endtimestamp;
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

   wait: function(action){
      this.waitAction = action;
      this.status = new EventStatus('Waiting');
      this.eventLog.put(timestamp, new EventStatus('Waiting'));
      this.timestamp = timestamp;
      //set alarm in calendar/schedule and add to parties waiting and due lists
   },

   resume: function(timestamp){
      this.status = new EventStatus('Executing');
      this.eventLog.put(timestamp, new EventStatus('Resumed'));
      this.timestamp = timestamp;
      this.resumedtimestamp = timestamp;
      this.notifyPerformers();
   },

   complete: function(timestamp){
      this.status = new EventStatus('Completed');
      this.eventLog.put(timestamp, new EventStatus('Completed'));
      this.timestamp = timestamp;
      this.completedtimestamp = timestamp;
      this.notifyReferencedActions();
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
   }

});

module.exports.Action = Action;

var Plan = new Class(Action, {

   initialize: function(name, actiontype, authority) {
      this.callSuper(name, actionType);
      this.authority = new Set(authority); // party == authority, 
      this.actionReference = new Set();
   },

   addActionReference: function(actionReference){
      this.actionReference.add(actionReference);
   },

   removeActionReference: function(actionReference){
      this.actionReference.remove(actionReference);
   },

   addAuthority: function(party){
      //role == party type
      this.authority.add(party);
   },

   addAuthorities: function(partys){
      this.authority.merge(partys);
   },

   getAuthority: function(){
      return this.authority;
   },

   removeAuthority: function(party){
      //role == party type
      this.authority.remove(party);
   },

   removeAuthorities: function(partys){
      this.authority = this.authority.difference(partys);
   },

   receiveNotification: function(action){
      this.authority = this.authority.difference(partys);
   },

});

module.exports.Plan = Plan;

var ProposedAction = new Class(Action, {

   extend:{
      new:function (name, actionType) {
         var action = new this(name, actionType);
         return action;
      }
   },

   initialize: function(name, actionType) {
      this.callSuper(name, actionType);
      this.allowedEventTypes = new Set();
      this.participants = new Set();
   },

   schedule: function(starttimestamp){
      this.status = new EventStatus('Scheduled');
      this.eventLog.put(new Date(), new EventStatus('Scheduled/Proposed'));
      this.scheduledstart = starttimestamp;
   },
   
   schedulePeriod: function(starttimestamp, timeperiod){
      this.status = new EventStatus('Scheduled');
      this.eventLog.put(new Date(), new EventStatus('Scheduled/Proposed'));
      this.scheduledstart = starttimestamp;
      this.scheduledend = starttimestamp + timeperiod;
   },

   start: function(timestamp){
      var action = new ImplementedAction.new(this.name, this.actionType);
      action.start(timestamp);
      this.status = new EventStatus('Started/Implemented');
      this.eventLog.put(timestamp, new EventStatus('Started/Implemented'));
      this.timestamp = timestamp;
      this.startedtimestamp = timestamp;
   },

   postpone: function(time){
      var timestamp = new Date();
      this.status = new EventStatus('Postponed');
      this.eventLog.put(timestamp, new EventStatus('Postponed'));
      this.timestamp = timestamp;
      /*var scheduledate;
      if (time.type == 'timeperiod' ) {
         scheduledate = new Date() + time.duration;
      } else if(time.type == 'timepoint' ){
         scheduledate = time.date;
      };
      this.performers.schedule(scheduledate, this);*/
   },

   suspend: function(duetime){
      this.status = new EventStatus('Waiting');
      this.eventLog.put(timestamp, new EventStatus('Waiting'));
      this.timestamp = timestamp;
      //this.performers.schedule(duetime, this);
      //set alarm in calendar/schedule and add to parties waiting and due lists
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

   bookResource: function(resourcetype, args){
      this.resources = new Array();
      this.resources.push(new ResourceAllocation(resourcetype, args));
      
   },

   addLocation: function(location){      
      this.location = new Location('location');
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

module.exports.ProposedAction = ProposedAction;

var ImplementedAction = new Class(Action, {

   extend:{
      new:function (name, actionType) {
         var action = new this(name, actionType);
         return action;
      }
   },

   initialize: function(name, actionType) {
      this.callSuper(name, actionType);
      this.allowedEventTypes = new Set();
      this.participants = new Set();
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

   useResource: function(resourcetype){

      
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

module.exports.ImplementedAction = ImplementedAction;

var Transaction = new Class(Event, {

   initialize: function(name, transactionType) {
      this.callSuper(name, transactionType);
   },

   schedule: function(starttimestamp, endtimestamp){
      this.status = new EventStatus('Scheduled');
      this.eventLog.put(new Date(), new EventStatus('Scheduled'));
      this.scheduledstart = starttimestamp;
      this.scheduledend = endtimestamp;
   },

   tstart: function(timestamp, sourceaccounts, destinationaccounts, valueobject){
      //lock various accounts, manipulate them, then unlock the accounts
      this.sourceAccount = sourceaccounts[0];
      this.destinationAccount = destinationaccounts[0];
      this.valueobject = valueobject;
      this.timestamp = timestamp;
      this.starttimestamp = timestamp;
      this.eventLog.put(timestamp, new EventStatus('TransactionStart'));
   },

   commit: function(timestamp){
      //enter account/resource entries
      this.timestamp = timestamp;
      this.endtimestamp = timestamp;
      //this.sourceAccount.credit(this);
      this.destinationAccount.debit(this);
      if(this.sourceAccount.get(this).value() - this.destinationAccount.get(this).value() == 0){
         this.eventLog.put(timestamp, new EventStatus('TransactionCommit'));
         return true;
      }else{
         this.rollback(new Date());
      }
   },

   rollback: function(timestamp){
      this.timestamp = timestamp;
      this.endtimestamp = timestamp;
      /*var reversal = this.negate(this);
      reversal.eventId = Uuid.v4();
      this.sourceAccount.credit(reversal);
      this.destinationAccount.debit(reversal);*/
   }

});

module.exports.Transaction = Transaction;
