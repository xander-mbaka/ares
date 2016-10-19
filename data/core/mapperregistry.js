require('jsclass');
var Class = require('jsclass/src/core').Class;
var Hash = require('jsclass/src/hash').Hash;

var MapperRegistry = new Class({

   extend: {

      mappers: new Hash(),

      register:function (object, mapper) {         
         mapper.loadDataMap(object);
         this.mappers.put(object.klass, mapper);
      },

      getMapper:function (obj, cb) {         
         cb(this.mappers.get(obj.klass));
      }
   },

   initialize: function() {
   },

});

module.exports.MapperRegistry = MapperRegistry;