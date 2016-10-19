require('jsclass');
var Class = require('jsclass/src/core').Class;
var Hash = require('jsclass/src/hash').Hash;
var Set = require('jsclass/src/set').Set;
var Console = require('jsclass/src/console').Console;
var AbstractMapper = require("../../data/core/datamapper").AbstractMapper;
var DataMap = require("../../data/core/datamapper").DataMap;
var DomainObject = require("../../data/core/datamapper").DomainObject;

//var Uuid = require("node-uuid");

var PartyType = new Class(DomainObject, {//Role

   initialize: function(name) {
      this.name = name;      
      this.privileges = new Set();
   },

   addPrivilege:function (privilege) {
      this.privileges.add(privilege);
   },

   getPrivileges:function () {
      return this.privileges;
   },

   hasPrivileges:function (privilege) {
      this.privileges.forEach(function(value) {
         if (value == privilege) {
            return true;
         }
      });
      return null;
   },

   getPrivilege:function (privilege) {
     this.privileges.forEach(function(value) {
         if (value == privilege) {
            return value;
         }
      });
      return null;
   },

});

module.exports.PartyType = PartyType;

var Party = new Class(DomainObject, {

   initialize: function(name) {
      this.parentAccountabilities = new Set();
      this.childAccountabilities = new Set();
      this.transactions = new Set();
      this.roles = new Set();
      this.name = name;
   },

   friendAddChildAccountability: function(accountability){
      this.childAccountabilities.add(accountability);
   },

   friendAddParentAccountability: function(accountability){
      this.parentAccountabilities.add(accountability);
   },

   addRole:function (partytype) {
      this.roles.add(partytype);
   },

   getRole:function (partytype) {
      this.roles.forEach(function(role) {
         if (role == partytype) {
            return role;
         }
      });
      return null;
   },

   getRoles:function () {
      return this.roles;
   },

   setAddress:function (address) {
      this.address = address;
   },

   setPhoneNumber:function (phonenumber) {
      this.phonenumber = phonenumber;
   },

   setEmail:function (email) {
      this.email = email;
   },

   parents: function(){
      var result = new Set();
      this.parentAccountabilities.forEach(function(x) {
         result.add(x.parent());
      });
      return result;
   },

   parents: function(partytype){
      var result = new Set();
      this.parentAccountabilities.forEach(function(x) {
         if (x.type() == partytype) {
            result.add(x.parent());
         }
      });
      return result;
   },

   ancestorsInclude: function(party, partytype){
      this.parents(partytype).forEach(function(eachParent) {
         if (eachParent == party) return true;
         if (eachParent.ancestorsInclude(party, partytype)) return true;
      });
      return false;
   },

   canPerformEvent:function (role, event) {
      //check event.type against the domain concepts of any of the  party types i.e this.roles()
      //transactionevent.abandon(new Date());
   }

});

module.exports.Party = Party;

var DomainPartyType = new Class(PartyType,{

   initialize: function(name) {
      this.callSuper(name);
      this.domainConcepts = new Set();
   },

   initialize: function(name, eventTypes) {
      //where event types == action/transaction/composite where 
      this.callSuper(name);
      this.domainConcepts = new Set(eventTypes);
   },

   addDomainConcept: function(name, eventTypes){
      this.domainConcepts.add(new DomainConcept(name, eventTypes));
   },

   areValidEventTypes: function(eventss){
      var t = new Array();
      this.DomainConcepts.forEach(function(rule) {
         t.push(rule.isValid(parent, child));
      });
      for (var i = 0; i < t.length; i++) {
         if (t[i] == true) {
            return true;
         }
      }; 
      return false;    
      /*this.domainConcepts.forEach(function(rule) {
         if (rule.isValid(parent, child)) return true;
      });*/
      
   },

   canCreateTransactions: function(party){
      if (party.getRole(this)) return true;
      return this.areValidTransactionTypes(parent, child);
   }  

});

module.exports.DomainPartyType = DomainPartyType;