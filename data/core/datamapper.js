require('jsclass');
var _ = require("underscore");
var Console = require('jsclass/src/console').Console;
var Class = require('jsclass/src/core').Class;
var Set = require('jsclass/src/set').Set;
var Hash = require('jsclass/src/hash').Hash;
var mysql = require('mysql');
var MapperRegistry = require("./mapperregistry").MapperRegistry;
var UoW = require("./unitofwork").UnitOfWork;

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'andromeda',
  database : 'ares'
});

//METADATA MAPPING
var DataMap = new Class({
  
   initialize: function(klass, table) {
      this.domainClass = klass;
      this.tableName = table;
      this.columnMaps = new Array();
   },

   addColumnMap: function(cname, fname, type, length) {
      this.columnMaps.push(new ColumnMap(cname, fname, type, length, this));
   },

   columnList: function() {
      var stmt = 'id';
      this.columnMaps.forEach(function(columnMap, index) {
         stmt += ', '+columnMap.columnName;
      })
      return stmt;
   },

   insertList: function () {
      var result = '?';
      this.columnMaps.forEach(function(columnMap, index) {
         result += ',?';
      });

      return result;
   },

   updateList: function () {
      var result = 'SET ';
      this.columnMaps.forEach(function(columnMap, index) {
         result += columnMap.columnName+'=?, ';
      });

      return result.substring(0, (result.length - 2))+' ';
   }
});

var ColumnMap = new Class({
  
   initialize: function(cname, fname, type, length, dmap) {
      this.columnName = cname;
      this.fieldName = fname;
      this.dataType = type;
      this.length = length;
      this.dataMap = dmap;
   },

   setField: function(object, columnValue) {
      var obj = {}
      obj[this.fieldName] = columnValue;
      object.setFields(obj);
   },

   getValue: function(object) {
      return object[this.fieldName];
   },
});

//DATA MAPPER
var AbstractMapper = new Class({
  
   initialize: function() {
      this.loadedMap =  new Hash();
      this.dataMap =  new Set();      
      this.mapLoaded = false;
      this.allLoaded = false;
      //this.loadDataMap();
   },

   loadFields: function(args, object, cb){
      var dmap = this.dataMap;
      dmap.columnMaps.forEach( function(columnMap, index) {
         var columnValue = args[columnMap.columnName];
         columnMap.setField(object, columnValue);
         if (dmap.columnMaps.length == ++index) {
            cb(object);
         }
      });
   },

   load: function(args, cb){
      var UnitOfWork = UoW.getCurrent();
      var id = parseInt(args.id, 10);
      var self = this;   
      if (this.loadedMap.hasKey(id)) {
         var object = this.loadedMap.get(id);
         UnitOfWork.registerClean(object); 
         //object.objloc = 'mem';
         cb(object);
      } else{
         var result =  this.dataMap.domainClass.newInstance();
         result.setFields({id: id});
                 
         this.loadFields(args, result, function (object) {
            //Console.print('This ? '+JSON.stringify(object))
            object.loadObjects();
            UnitOfWork.registerClean(object);
            self.loadedMap.store(id, object);
            cb(object);
         });
      };     
   },   

   loadAll: function(results, cb){
      var objects = new Array();
      var self = this;
      var total = results.length;
      var count = 0;
      results.forEach( function(element, index) {
         self.load(element, function (object) {
            objects.push(object);
            ++count;
            if (total == count) {
               cb(objects);
            }
         })
      });
   },

   find: function(id, cb){
      if (this.loadedMap.hasKey(id)) {
         var obj = this.loadedMap.get(id);
         //obj.objloc = 'mem';
         cb(obj);
      }else{
         var stmt = this.findById(id);
         this.executeFind(stmt, function (result) {
            cb(result)
         });
      }
      
   },

   findObject: function(id, cb){
      if (this.loadedMap.hasKey(id)) {
         var obj = this.loadedMap.get(id);
         //obj.objloc = 'mem';
         cb(obj);
      }else{
         var stmt = this.findById(id);
         this.executeFind(stmt, function (result) {
            cb(result)
         });
      }
   },

   findAll: function(cb){
      var self = this;
      if (this.allLoaded) {
         cb(this.loadedMap.values);
      } else {
         var stmt = this.findAllStatement();
         this.executeFind(stmt, function (objects) {
            cb(objects)
            this.allLoaded = true;
         });
      }
      
   },

   findWhere: function(stmt, cb){
      this.executeFind(stmt, function (objects) {
         cb(objects)
      });
   },

   insert: function(object, cb){
      var self = this;
      /*this.getNewObjectId(function (id) {
         object.setFields({id: id});         
         var stmt = self.insertStatement();
         self.executeInsert(stmt, function (res) {
            //this.doInsert(object, res);
            self.loadedMap.put(object.id, object);
            cb(object.id);
         });
         self.update(object, function (res) {
            self.loadedMap.put(object.id, object);
            cb(res.id);
         })
         
      });*/
      try {
         var values = [];
         var dmap = this.dataMap;
         values.push('');         
         dmap.columnMaps.forEach( function(columnMap, index) {
            values.push(columnMap.getValue(object));    

            if ((dmap.columnMaps.length+1) == values.length) {   
            //Console.print(self.insertStatement())              
               var sql = self.insertStatement();
               self.executeInsert(sql, values, function (result) {
                  object.setFields({id: result.id});
                  self.loadedMap.put(object.id, object);
                  cb(object)
               });
            };
         });      
      } catch (e) {
         //Log error and retry
      }
   },

   insertUpdate: function (object, cb) {
      //if (!this.mapLoaded) {this.loadDataMap()};
      var self = this;      
      try {
         var values = [];
         var dmap = this.dataMap;             
         dmap.columnMaps.forEach( function(columnMap, index) {
            values.push(columnMap.getValue(object));            
            if (dmap.columnMaps.length == values.length) {
               values.push(object.id);
               var sql = self.updateStatement();
               self.executeUpdate(sql, values, function (result) {
                  self.loadedMap.put(object.id, object);
                  cb(result)
               });
            };
         });      
      } catch (e) {
         //Log error and retry
      }
   },

   update: function (object, cb) {
      //if (!this.mapLoaded) {this.loadDataMap()};
      var self = this;      
      try {
         var values = [];
         var dmap = this.dataMap;             
         dmap.columnMaps.forEach( function(columnMap, index) {
            values.push(columnMap.getValue(object));            
            if (dmap.columnMaps.length == values.length) {
               values.push(object.id);
               var sql = self.updateStatement();
               self.executeUpdate(sql, values, function (result) {
                  self.loadedMap.put(object.id, object);
                  cb(result)
               });
            };
         });      
      } catch (e) {
         //Log error and retry
      }
   },

   delete: function(object, cb){
      var self = this;    
      try {
         var sql = this.deleteByIdStatement(object.id);
         this.executeDelete(sql, function (result) {
            if (result) {
               self.loadedMap.remove(object.id);
               cb(true)
            }else{
               cb(false)
            }
         });   
      } catch (e) {
         //Log error and retry
      }
      
   },

   /*
   FIND METHODS WITHOUT USE OF A DATA MAPPER
   
   load: function(args){ 
      var UnitOfWork = UoW.getCurrent();     
      var id = parseInt(args.id, 10);
      
      if (this.loadedMap.hasKey(id)) {
         var object = this.loadedMap.get(id)
         UnitOfWork.registerClean(object); 
         return object;
      } else{
         var object = this.doLoad(id, args);
         UnitOfWork.registerClean(object); 
         this.loadedMap.store(id, object);      
         return object;
      };     
   },

   executeFind: function(stmt, cb){
      var self = this;
      try {
         connection.query(stmt, function (error, results, fields) {
            if (error) throw error;
            if (results.length == 1) {
               cb(self.load(results[0]));
            };

            if (results.length > 1) {
               self.loadAll(results, function (objects) {
                  cb(objects)
               })
            };
         });
      } catch(e) {
         Console.print(e);
      }
   },*/

   executeFind: function(stmt, cb){
      //Console.print(stmt);
      var self = this;
      try {
         connection.query(stmt, function (error, results, fields) {
            if (error) throw error;
            
            if (results.length == 0) {
               cb(false);
            };

            if (results.length == 1) {
               self.load(results[0], cb);
            };

            if (results.length > 1) {
               self.loadAll(results, function (objects) {
                  cb(objects)
               })
            };
         });
      } catch(e) {
         Console.print(e);
      }
   },

   executeInsert: function(sql, values, cb){
      try {
         connection.query(sql, values, function (error, result) {
            if (error) throw error;
            cb(result);
         });
      } catch(e) {
         Console.print(e);
      }
   },

   executeUpdate: function(sql, values, cb){
      //var mapper = this;
      try {
         connection.query(sql, values, function (error, results) {
            if (error) throw cb(false);
            cb(true);
         });
      } catch(e) {
         Console.print(e);
      }
   },

   executeDelete: function(sql, cb){
      //var mapper = this;
      try {
         connection.query(sql, function (error, results) {
            if (error) throw cb(false);
            if (results.affectedRows == 1) {
               cb(true)
            } else {
               cb(false)
            }
         });
      } catch(e) {
         Console.print(e);
      }
   },

   findById: function(id){
      return 'SELECT ' + this.dataMap.columnList() + ' FROM ' + this.dataMap.tableName + ' WHERE id = ' + id;
   },

   findAllStatement: function(){
      return 'SELECT * FROM ' + this.dataMap.tableName + ' ORDER BY id ASC';
   },

   createIgnoreTableStatement: function(){
      //return 'INSERT INTO ' + this.dataMap.tableName + ' (' + this.dataMap.columnList() + ') VALUES (' + this.dataMap.insertList() + ')';
   },

   insertStatement: function(){
      return 'INSERT INTO ' + this.dataMap.tableName + ' (' + this.dataMap.columnList() + ') VALUES (' + this.dataMap.insertList() + ')';
   },

   insertUpdateStatement: function(){
      return 'UPDATE ' + this.dataMap.tableName + ' ' + this.dataMap.updateList() + ' WHERE id = ?';
   },

   updateStatement: function(){
      return "UPDATE " + this.dataMap.tableName  + ' '+ this.dataMap.updateList() + " WHERE id = ?";
   },

   deleteByIdStatement: function(id){
      return 'DELETE FROM ' + this.dataMap.tableName + ' WHERE id = ' + id;
   },

   getNewObjectId: function (cb) {
      //Ideally should be from an in-memory identity manager self gives a uuid that is later matched to a db key.
      connection.query('INSERT INTO ' + this.dataMap.tableName + ' SET ?', {id: 0}, function(err, result) {
        if (err) throw err;

        cb(result.insertId);
      });
   }
});

//DOMAIN SUPERTYPE
var DomainObject = new Class({

   extend: {

      newInstance:function () {
         return new this();
      },

      find:function (id, cb) {
         MapperRegistry.getMapper(this.newInstance(), function (mapper) {
            mapper.find(id, function (callback) {
               cb(callback)
            });
         })
      },

      findObject:function (id, cb) {
         MapperRegistry.getMapper(this.newInstance(), function (mapper) {
            mapper.findObject(id, function (callback) {
               cb(callback)
            });
         })
      },

      findAll:function (cb) {
         MapperRegistry.getMapper(this.newInstance(), function (mapper) {
            mapper.findAll(function (results) {
               cb(results)
            });
         })
      },

      getNextId:function (cb) {
        MapperRegistry.getMapper(this.newInstance(), function (mapper) {
            mapper.getNewObjectId(function (id) {
               cb(id)
            });
         })
      },
   },
  
   initialize: function() {
      //this.marknew()
   },

   setFields:function (args) {
      var self = this;
      _(args).each(function (value, key) {
         self[key] = value;
      });
      //Mark dirty doesnt apply here as this is used to load objects
   },

   modifyFields:function (args) {
      var self = this;
      _(args).each(function (value, key) {
         self[key] = value;
      });
      this.markDirty();
   },

   loadObjects:function () {
   },

   markNew:function () {
      //Session.unitOfWork.registerNew(this)
      var UnitOfWork = UoW.getCurrent();
      UnitOfWork.registerNew(this)
   },

   markNewId:function () {
      //Session.unitOfWork.registerNew(this)
      var UnitOfWork = UoW.getCurrent();
      UnitOfWork.registerNewId(this)
   },

   markClean:function () {
      //Session.unitOfWork.registerClean(this)
      var UnitOfWork = UoW.getCurrent();
      UnitOfWork.registerClean(this)
   },

   markDirty:function () {
      //Session.unitOfWork.registerDirty(this)
      var UnitOfWork = UoW.getCurrent();
      UnitOfWork.registerDirty(this);
      //uow.registerDirty(this)
   },

   markRemoved:function () {
      //Session.unitOfWork.registerRemoved(this)
      UnitOfWork.registerRemoved(this)
   }
});

module.exports.AbstractMapper = AbstractMapper;
module.exports.DomainObject = DomainObject;
module.exports.DataMap = DataMap;
module.exports.ColumnMap = ColumnMap;

