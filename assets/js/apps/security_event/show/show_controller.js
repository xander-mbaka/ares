define(["app", "apps/security_event/show/show_view"], function(System, View){
  System.module('SecurityEventsApp.Show', function(Show, System, Backbone, Marionette, $, _){
    Show.Controller = {

      addCompoundEvent: function(){ 
        var view = new View.CompoundEvent();
        
        System.contentRegion.show(view);

        view.on('create', function(data) {
          data['operation'] = 'addEmployee';
            $.post(System.coreRoot + '/service/hrm/index.php', data, function(result) {
              if (result == 1) {
                view.triggerMethod("success");
              }else{
                view.triggerMethod("error");
              }
            });
        });

        view.on('edit', function(data) {
          data['operation'] = 'editEmployee';
            $.post(System.coreRoot + '/service/hrm/index.php', data, function(result) {
              if (result == 1) {
                view.triggerMethod("success");
              }else{
                view.triggerMethod("error");
              }
            });
        });

        view.on('del', function(data) {
          data['operation'] = 'deleteEmployee';
            $.post(System.coreRoot + '/service/hrm/index.php', data, function(result) {
              if (result == 1) {
                view.triggerMethod("delete");
              }else{
                view.triggerMethod("error");
              }
            });
        });
      },

      showCompoundEvents: function(){ 

        var view = new View.CompoundEvents();
        System.contentRegion.show(view);

        view.on('del', function(id) {
          var data = {};
          data['operation'] = 'deleteEmployee';
          data['id'] = id;
          $.post(System.coreRoot + '/service/hrm/index.php', data, function(result) {
            if (result == 1) {
              view.triggerMethod("delete");
            }else{
              view.triggerMethod("error");
            }
          });
        });
	    }
      
    };
  });

  return System.SecurityEventsApp.Show.Controller;
});
