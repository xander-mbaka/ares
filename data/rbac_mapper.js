require('jsclass');
var Class = require('jsclass/src/core').Class;
var Console = require('jsclass/src/console').Console;
var AbstractMapper = require("./core/datamapper").AbstractMapper;
var DataMap = require("./core/datamapper").DataMap;

var ViewMapper = new Class(AbstractMapper, {
  
   initialize: function() {
      this.callSuper();
   },

   loadDataMap: function (object) {
      this.domainClass = object.klass;
      this.dataMap = new DataMap(this.domainClass, 'views');
      this.dataMap.addColumnMap('module_id', 'moduleId', 'int', 11);
      this.dataMap.addColumnMap('name', 'name', 'varchar', 255);
      this.dataMap.addColumnMap('logo', 'logo', 'varchar', 255);
      this.dataMap.addColumnMap('link', 'link', 'varchar', 255);
      this.dataMap.addColumnMap('pos', 'position', 'varchar', 255);
      this.mapLoaded = true;
   },

   getNextViewPosition: function (moduleId, cb) {
      connection.query('SELECT * FROM '+this.dataMap.tableName+' WHERE module_id = '+ moduleId +' ORDER BY pos DESC LIMIT 0,1', function(err, result, fields) {
        if (err) throw err;

        cb(results[0].pos);
      });
   },

   findWhereModuleStatement: function(moduleId){
      return 'SELECT * FROM '+this.dataMap.tableName+' WHERE module_id = '+ moduleId +' AND status = 1 ORDER BY pos ASC';
   },

   findWhereStatusStatement: function(status){
      return 'SELECT * FROM '+this.dataMap.tableName+' WHERE status = '+ status +' ORDER BY pos ASC';
   }

});

var ModuleMapper = new Class(AbstractMapper, {
  
   initialize: function() {
      this.callSuper();
   },

   loadDataMap: function (object) {
      this.domainClass = object.klass;
      this.dataMap = new DataMap(this.domainClass, 'modules');
      this.dataMap.addColumnMap('name', 'name', 'varchar', 255);
      this.dataMap.addColumnMap('logo', 'logo', 'varchar', 255);
      this.dataMap.addColumnMap('status', 'status', 'tinyint', 2);
      this.dataMap.addColumnMap('position', 'position', 'varchar', 255);
      this.dataMap.addColumnMap('view_ids', 'viewids', 'varchar', 255);
      this.mapLoaded = true;
   },

   findActiveModulesStatement: function(id){
      return 'SELECT * FROM '+this.dataMap.tableName+' WHERE status = 1 ORDER BY position ASC';
   }

});

var RoleMapper = new Class(AbstractMapper, {
  
   initialize: function() {
      this.callSuper();
   },

   loadDataMap: function (object) {
      this.domainClass = object.klass;
      this.dataMap = new DataMap(this.domainClass, 'roles');
      this.dataMap.addColumnMap('name', 'name', 'varchar', 255);
      this.dataMap.addColumnMap('views', 'views', 'varchar', 255);
      this.dataMap.addColumnMap('operations', 'operations', 'varchar', 255);
      this.mapLoaded = true;
   },

   existsInDBStatement: function(name){
      return 'SELECT * FROM '+this.dataMap.tableName+' WHERE name = "' + name + '"';
   }

});

var UserMapper = new Class(AbstractMapper, {
  
   initialize: function() {
      this.callSuper();
   },

   loadDataMap: function (object) {
      this.domainClass = object.klass;
      this.dataMap = new DataMap(this.domainClass, 'users');
      this.dataMap.addColumnMap('username', 'username', 'varchar', 255);
      this.dataMap.addColumnMap('password', 'password', 'varchar', 255);
      this.dataMap.addColumnMap('category', 'category', 'varchar', 255);
      this.dataMap.addColumnMap('party_id', 'partyId', 'varchar', 255);
      this.dataMap.addColumnMap('role_id', 'roleId', 'varchar', 255);
      this.dataMap.addColumnMap('status', 'status', 'tinyint', 2);
      this.mapLoaded = true;
   },

   existsInDBStatement: function(partyId, category){
      return 'SELECT * FROM '+this.dataMap.tableName+' WHERE party_id = ' + partyId + ' AND category = "' + category + '"';
   },

   findActiveUsersStatement: function(){
      return 'SELECT * FROM '+this.dataMap.tableName+' WHERE access = 1 AND username IS NOT NULL';
   },

   findAuthorizedUserStatement: function(username, password){
      //First run the query on the in memory dataset
      return 'SELECT * FROM '+this.dataMap.tableName+' WHERE username = "' + username + '" AND password = "' + password + '" AND access = 1 LIMIT 0,1';
   }

});

module.exports.ViewMapper = ViewMapper;
module.exports.ModuleMapper = ModuleMapper;
module.exports.UserMapper = UserMapper;
module.exports.RoleMapper = RoleMapper;