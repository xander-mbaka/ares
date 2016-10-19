require('jsclass');
var Console = require('jsclass/src/console').Console;
var Class = require('jsclass/src/core').Class;
var Set = require('jsclass/src/set').Set;
var Hash = require('jsclass/src/hash').Hash;
var LinkedList = require('jsclass/src/linked_list').LinkedList;
var MapperRegistry = require("./mapperregistry").MapperRegistry;
//var MapperRegistry = new MR();

var UnitOfWork = new Class({

   extend: {

      loaded: false,

      olduows: new Array(),

      newCurrent:function () {
         this.current = new this();
      },

      getCurrent:function () {
         return this.current;
         
      }
   },

   initialize: function() {
      this.newObjects = new Set();
      this.newIdObjects = new Set();
      this.dirtyObjects = new Set();
      this.removedObjects = new Set();
   },

   reset: function() {
      this.klass.olduows.push(new Array(this.newObjects, this.newIdObjects, this.dirtyObjects, this.removedObjects));
      this.newObjects = new Set();
      this.newIdObjects = new Set();
      this.dirtyObjects = new Set();
      this.removedObjects = new Set();      
   },

   registerNew: function(object){
      if (!this.newObjects.contains(object) && !this.newIdObjects.contains(object) && !this.dirtyObjects.contains(object) && !this.removedObjects.contains(object)) {
         this.newObjects.add(object);
         return true;
      }else{
         return false;
      }
   },

   registerNewId: function(object){
      if (!this.newObjects.contains(object) && !this.newIdObjects.contains(object) && !this.dirtyObjects.contains(object) && !this.removedObjects.contains(object)) {
         this.newIdObjects.add(object);
         return true;
      }else{
         return false;
      }
   },

   registerDirty: function(object){

      if (!this.newObjects.contains(object) && !this.newIdObjects.contains(object) && !this.dirtyObjects.contains(object) && !this.removedObjects.contains(object)) {         
         this.dirtyObjects.add(object);         
         return true;
      }else{
         return false;
      }
   },

   registerRemoved: function(object){
      if (!this.removedObjects.contains(object)) {
         this.removedObjects.add(object);
         return true;
      }else{
         return false;
      }
   },

   registerClean: function(object){
      if (object.id > 0) {
         return true;
      }else{
         return false;
      }
   },

   commit: function(cb){
      //pre-commit - save this object as blob to allow for      
      var self = this;
      self.insertNew(function (insertcount) {
         Console.print('\n'+insertcount+' objects inserted\n');
         self.insertNewId(function (insertidcount) {
            Console.print(insertidcount+' objects inserted (with id)\n');
            self.updateDirty(function (updatecount) {
               Console.print(updatecount+' objects updated\n');
               self.deleteRemoved(function (deletecount) {
                  Console.print(deletecount+' objects deleted\n'); 
                  self.reset();
                  cb(true)
               })
            })
         })
      })
   },

   insertNew: function(cb){
      var total = this.newObjects.count();
      var count = 0;
      if (total < 1) {
         cb(0)
      }else{
         this.newObjects.forEach(function(obj) {
            MapperRegistry.getMapper(obj, function (mapper) {
               mapper.insert(obj, function (result) {
                   ++count;
                  if (count == total) {
                     cb(count)
                  };
               });
               
            })
         });
      }
   },

   insertNewId: function(cb){
      var total = this.newIdObjects.count();
      var count = 0;
      if (total < 1) {
         cb(0)
      }else{
         this.newIdObjects.forEach(function(obj) {
            MapperRegistry.getMapper(obj, function (mapper) {
               mapper.insertUpdate(obj, function (result) {
                   ++count;
                  if (count == total) {
                     cb(count)
                  };
               });
               
            })
         });
      }
   },

   updateDirty: function(cb){
      var total = this.dirtyObjects.count();
      var count = 0;
      if (total < 1) {
         cb(0)
      }else{
         this.dirtyObjects.forEach(function(obj) {
            MapperRegistry.getMapper(obj, function (mapper) {
               mapper.update(obj, function (result) {
                   ++count;
                  if (count == total) {
                     cb(count)
                  };
               });
               
            })
         });
      }
   },

   deleteRemoved: function(cb){
      var total = this.removedObjects.count();
      var count = 0;
      var success = 0;
      if (total < 1) {
         cb(0)
      }else{
         this.removedObjects.forEach(function(obj) {
            if (obj.id != '') {
               MapperRegistry.getMapper(obj, function (mapper) {
                  mapper.delete(obj, function (result) {
                     if (result) {
                        ++success;
                     }
                     ++count;
                     if (count == total) {
                        cb(count, success)
                     };
                  });
                  
               })
            } else {
               //Do nothing
            }
            
         });
      }
   }

});

module.exports.UnitOfWork = UnitOfWork;