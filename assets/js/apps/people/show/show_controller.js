define(["app", "apps/people/show/show_view"], function(System, View){
  System.module('PeopleApp.Show', function(Show, System, Backbone, Marionette, $, _){

    Show.Controller = {

      addVisitor: function(){ 
        var view = new View.Visitor();
        
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

      addStaff: function(){ 
        var view = new View.Staff();
        
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

      personRegistry: function(){ 
        var x = Backbone.Model.extend({
          urlRoot: "service/hrm",
        });
        var model = new x;
        
        model.set('type', 'employees');

        var view = new View.PersonRegistry({model: model});
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

      screenList: function(){ 
        var view = new View.ScreenList();
        
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

      appointments: function(){ 
        var view = new View.Appointments();
        
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

      checkIn: function(){ 
        var view = new View.CheckIn();

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
      },

      checkOut: function(){ 
        var view = new View.CheckOut();

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
      },

      verifyAccess: function(){ 
        var view = new View.VerifyAccess();

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

  return System.PeopleApp.Show.Controller;
});
