define(["app", "apps/counter_measures/show/show_view"], function(System, View){
  System.module('CounterMeasuresApp.Show', function(Show, System, Backbone, Marionette, $, _){
    Show.Controller = {

      counterMeasureTypes: function(){ 
        var view = new View.CounterMeasureTypes();
        
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

      addCounterMeasure: function(){ 
        var view = new View.CounterMeasure();
        
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

      showCounterMeasures: function(){ 

        var view = new View.CounterMeasures();
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

      counterMeasureData: function(){ 
        var view = new View.CounterMeasureData();

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

  return System.CounterMeasuresApp.Show.Controller;
});
