define(["app", "apps/security/show/show_controller"], function(System, showController){
  System.module('SecurityApp', function(SecurityApp, System, Backbone, Marionette, $, _){

    SecurityApp.Router = Marionette.AppRouter.extend({

      //controller: showController,

      appRoutes: {
        "dash" : "showDash",
        "postMemo" : "postMemo",
        "viewMemos" : "viewMemos",
        "eventAnalysis" : "eventAnalysis",
        "eventLog" : "eventLog"
      }
    });

    System.addInitializer(function(){
      new SecurityApp.Router({
        controller: showController
      });
    });

    System.on("employees:show", function(){
      System.navigate("employees");
      showController.showemployees();
    });
    
    
  });

  return System.SecurityApp;
});

