require('jsclass');
JS.require('JS.Class');
JS.require('JS.Hash');
JS.require('JS.Set');


var AccountabilityType = new JS.Class({
  
   initialize: function(name) {
      this.name = name;
      this.hierarchic = false;
   },

   beHierarchic: function(){
      this.hierarchic = true;
   }

});

module.exports.AccountabilityType = AccountabilityType;


var Accountability = new JS.Class({
  
   extend:{

      create:function (parent, child, accountabilitytype) {
         if (!this.canCreate(parent, child, accountabilitytype)) {
            return 'Error: Invalid accountability';
         } else{
            return new this(parent, child, accountabilitytype);
         };
      },

      canCreate:function (parent, child, accountabilitytype) {
         if (parent == child) return false;
         if (parent.ancestorsInclude(child, accountabilitytype)) return false;
         return accountabilitytype.canCreateAccountability(parent, child);
      },
   },

   initialize: function(parent, child, accountabilitytype) {      
      this.parent = parent;
      this.child = child;
      parent.friendAddChildAccountability(this);
      child.friendAddParentAccountability(this);
      this.type = accountabilitytype;
   },

   child: function(){
      return this.child;
   },

   parent: function(){
      return this.parent;
   },

   type: function(){
      return this.type;
   }

});

module.exports.Accountability = Accountability;

var PartyType = new JS.Class({//Role

   initialize: function(name) {
      this.name = name;
   }

});

module.exports.PartyType = PartyType;

var Hash = require("../database/Hash");

var Party = new JS.Class({

   initialize: function(name, PartyType) {
      this.parentAccountabilities = new JS.Set();
      this.childAccountabilities = new JS.Set();
      this.name = name;
      this.type = PartyType;
   },

   friendAddChildAccountability: function(accountability){
      this.childAccountabilities.add(accountability);
   },

   friendAddParentAccountability: function(accountability){
      this.parentAccountabilities.add(accountability);
   },

   parents: function(){
      var result = new JS.Set();
      this.parentAccountabilities.forEach(function(x) {
         result.add(x.parent());
      });
      return result;
   },

   parents: function(accountabilitytype){
      var result = new JS.Set();
      this.parentAccountabilities.forEach(function(x) {
         if (x.type() == accountabilitytype) {
            result.add(x.parent());
         }
      });
      return result;
   },

   ancestorsInclude: function(party, accountabilitytype){
      this.parents(accountabilitytype).forEach(function(eachParent) {
         if (eachParent == party) return true;
         if (eachParent.ancestorsInclude(party, accountabilitytype)) return true;
      });
      return false;
   }

});

module.exports.Party = Party;

//Domain specific constructs

var ConnectionRule = new JS.Class({

   initialize: function(parentrole, childrole) {
      this.allowedParent = parentrole;
      this.allowedChild = childrole;
   },

   isValid: function(parent, child){
      return (parent.type == this.allowedParent && child.type == this.allowedChild);
   }

});

module.exports.ConnectionRule = ConnectionRule;

var ConnectedAccountabilityType = new JS.Class(AccountabilityType,{

   initialize: function(name) {
      this.callSuper(name);
      this.connectionRules = new JS.Set();
   },

   addConnectionRule: function(parentrole, childrole){
      this.connectionRules.add(new ConnectionRule(parentrole, childrole));
   },

   areValidPartyTypes: function(parent, child){
      var t = new Array();
      this.connectionRules.forEach(function(rule) {
         t.push(rule.isValid(parent, child));
      });
      for (var i = 0; i < t.length; i++) {
         if (t[i] == true) {
            return true;
         }
      }; 
      return false;    
      /*this.connectionRules.forEach(function(rule) {
         if (rule.isValid(parent, child)) return true;
      });*/
      
   },

   canCreateAccountability: function(parent, child){
      if (this.hierarchic == true && child.parents(this).size != 0) return false;
      return this.areValidPartyTypes(parent, child);
   }  

});

module.exports.ConnectedAccountabilityType = ConnectedAccountabilityType;