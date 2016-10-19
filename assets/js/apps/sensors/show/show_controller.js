define(["app", "apps/sensors/show/show_view"], function(System, View){
  System.module('SensorsApp.Show', function(Show, System, Backbone, Marionette, $, _){
    Show.Controller = {

      sensorTypes: function(){ 
        var view = new View.SensorTypes();
        
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

      sensorEvents: function(){ 
        var view = new View.SensorEvents();
        
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

      addSensor: function(){ 
        var view = new View.AddSensor();
        
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

      showSensors: function(){ 

        var view = new View.Sensors();
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

      sensorData: function(){ 
        var view = new View.SensorData();

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

  return System.SensorsApp.Show.Controller;
});
