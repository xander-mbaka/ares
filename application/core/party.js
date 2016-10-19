require('jsclass');
JS.require('JS.Class');
JS.require('JS.Hash');
JS.require('JS.Set');

var Hash = require("../database/Hash");
var Uuid = require("node-uuid");

var PartyType = new JS.Class({//Role

   initialize: function(name) {
      this.name = name;      
      this.privileges = new JS.Set();
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

var Party = new JS.Class({

   extend:{

      create:function (name) {
         return new this(name);
      }

   },

   initialize: function(name) {
      this.parentAccountabilities = new JS.Set();
      this.childAccountabilities = new JS.Set();
      this.transactions = new JS.Set();
      this.roles = new JS.Set();
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
      var result = new JS.Set();
      this.parentAccountabilities.forEach(function(x) {
         result.add(x.parent());
      });
      return result;
   },

   parents: function(partytype){
      var result = new JS.Set();
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

var DomainPartyType = new JS.Class(PartyType,{

   initialize: function(name) {
      this.callSuper(name);
      this.domainConcepts = new JS.Set();
   },

   initialize: function(name, eventTypes) {
      //where event types == action/transaction/composite where 
      this.callSuper(name);
      this.domainConcepts = new JS.Set(eventTypes);
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