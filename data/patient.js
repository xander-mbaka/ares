require('jsclass');
var Class = require('jsclass/src/core').Class;
var Console = require('jsclass/src/console').Console;
var AbstractMapper = require("./datamapper").AbstractMapper;
var DataMap = require("./datamapper").DataMap;
var DomainObject = require("./datamapper").DomainObject;
var MapperRegistry = require("./mapperregistry").MapperRegistry;
var UoW = require("./unitofwork").UnitOfWork;


var ClientMapper = new Class(AbstractMapper, {
  
   initialize: function() {
      this.callSuper();
   },

   loadDataMap: function (object) {
      //var klass = new ClientObject()
      //var obj = new ClientObject();
      this.domainClass = object.klass;
      this.dataMap = new DataMap(this.domainClass, 'clients');
      this.dataMap.addColumnMap('name', 'name', 'varchar');
      this.dataMap.addColumnMap('address', 'address', 'varchar');
      this.mapLoaded = true;
   },

   doLoad: function(id, args){
      return new ClientObject(id, args.name);;
   }

});

var ClientObject = new Class(DomainObject, {

   extend: {
      newInstance:function () {
         return new this('', '');
      },

      create:function (name, address) {
         var obj = new this('', name);
         obj.markNew();
         obj.setAddress(address);
         //Include logic for data integrity and duplicates 
         return obj;
      },

      createWithId:function (name, address, cb) {
         var self = this;
         self.getNextId(function (id) {
            var obj = new self(id, name);
            obj.markNewId();
            obj.setAddress(address);
            //Include logic for data integrity and duplicates 
            cb(obj);
         })
      },
   },
  
   initialize: function(id, name) {
      this.id = id;
      this.name = name;
   },

   setAddress: function(address) {
      this.address = address;
      this.markDirty();
   },

   setName: function(name) {
      this.name = name;
      this.markDirty();
   }

});

//Initialization Setup

MapperRegistry.register(ClientObject.newInstance(), new ClientMapper());

//Begin transaction/request
UoW.newCurrent();

//During transaction
var UnitOfWork = UoW.getCurrent();

/*/Console.print(JSON.stringify(obj.klass.displayName))

ClientObject.findObject(46, function (res) {
   Console.print(JSON.stringify(res))
   //res.setFields({address: '54th Floor, Kigio Plaza, THIKA'});

   res.setAddress('54th Floor, Kigio Plaza, THIKA');

   //res.setName('Azrael Dumas');

   UnitOfWork.commit(function (ack) {
      ClientObject.findObject(46, function (obj) {
         Console.print(JSON.stringify(obj));
      })
   });

});*/

var client = ClientObject.createWithId('Mama Milka kinyua', '56 and 5th Broadway, Avenue Park', function (client) {
   UnitOfWork.commit(function (ack) {
      ClientObject.findObject(client.id, function (obj) {
         Console.print(JSON.stringify(obj));
         //obj.setAddress('54th Floor, Kigio Plaza, THIKA');
         //UnitOfWork.commit(function (ack) {
         //});
      })
   });
});

//ClientObject.findObject(46, function (res) {
   //res.setAddress('75th Floor, Kigo Plaza, THIKA');

   //res.setName('Azrael Dumas');

   

//});




//module.exports.AbstractMapper = AbstractMapper;

