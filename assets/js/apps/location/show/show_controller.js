define(["app", "apps/location/show/show_view"], function(System, View){
  System.module('LocationApp.Show', function(Show, System, Backbone, Marionette, $, _){
    Show.Controller = {

      addLocation: function(){ 
        var view = new View.Location();
        
        System.contentRegion.show(view);

        view.on('create', function(data) {
          data.operation = 'addEmployee';
            $.post(System.coreRoot + '/service/hrm/index.php', data, function(result) {
              if (result == 1) {
                view.triggerMethod("success");
              }else{
                view.triggerMethod("error");
              }
            });
        });

        view.on('edit', function(data) {
          data.operation = 'editEmployee';
            $.post(System.coreRoot + '/service/hrm/index.php', data, function(result) {
              if (result == 1) {
                view.triggerMethod("success");
              }else{
                view.triggerMethod("error");
              }
            });
        });

        view.on('del', function(data) {
          data.operation = 'deleteEmployee';
            $.post(System.coreRoot + '/service/hrm/index.php', data, function(result) {
              if (result == 1) {
                view.triggerMethod("delete");
              }else{
                view.triggerMethod("error");
              }
            });
        });
      },

      showLocations: function(){ 
        var x = Backbone.Model.extend({
          urlRoot: "service/hrm",
        });
        var model = new x;
        
        model.set('type', 'employees');

        var view = new View.Locations({model: model});
        System.contentRegion.show(view);

        view.on('del', function(id) {
          var data = {};
          data.operation = 'deleteEmployee';
          data.id = id;
          $.post(System.coreRoot + '/service/hrm/index.php', data, function(result) {
            if (result == 1) {
              view.triggerMethod("delete");
            }else{
              view.triggerMethod("error");
            }
          });
        });
	    },

      showMap: function(){ 
        var view = new View.Map();

        System.contentRegion.show(view);

        view.on('post', function(data) {
          data.operation = 'postAllowance';
          $.post(System.coreRoot + '/service/hrm/index.php', data, function(result) {
            if (result !== 0) {
              var res = JSON.parse(result);
              //alert(JSON.stringify(res));
              if (res.transactionId) {
                view.triggerMethod("success", res);
              }else{
                view.triggerMethod("error");
              }
            }else{
              view.triggerMethod("error");
            }
          });
        });
      }
    };
  });

  return System.LocationApp.Show.Controller;
});
