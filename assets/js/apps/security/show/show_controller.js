define(["app", "apps/security/show/show_view"], function(System, View){
  System.module('SecurityApp.Show', function(Show, System, Backbone, Marionette, $, _){
    Show.Controller = {

      showDash: function(){ 
        var view = new View.Dash();
        System.contentRegion.show(view);        
      },

      postMemo: function(a){ 
        var view = new View.PostMemo();
        
        System.contentRegion.show(view);

        view.on('create', function(data) {
          data.operation = 'postmemo';
            $.post(System.coreRoot + '/service/tools/index.php', data, function(result) {
              if (result == 1) {
                view.triggerMethod("success");
              }else{
                view.triggerMethod("error");
              }
            });
        });
        /*require(["apps/entities/inventory"], function(){
          $.when(System.request("product:featured")).done(function(response){
            //alert(JSON.stringify(response.length));
            var view = new View.Slides({ collection: response });
            layout.slidesRegion.show(view); 
          });

          $.when(System.request("product:latest")).done(function(response){
            //alert(JSON.stringify(response.length));
            var view = new View.Latest({ collection: response });
            layout.latestRegion.show(view); 
          });
        }); */
      },

      viewMemos: function(a){ 
        var view = new View.OfficeMemos();

        System.contentRegion.show(view);

        /*view.on('check', function(stamp) {
          var data = {};
          data.operation = 'checkenquiry';
          data.stamp = stamp;
          $.post(System.coreRoot + '/service/tools/index.php', data, function(result) {
            if (result == 1) {
              view.triggerMethod("success");
            }else{
              view.triggerMethod("error");
            }
          });
        });*/
      },

      eventAnalysis: function(){ 
        var view = new View.EventAnalysis();
        
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

      eventLog: function(){ 
        var view = new View.EventLog();
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

      
    };
  });

  return System.SecurityApp.Show.Controller;
});
