define(["app", "apps/security_event/show/show_controller"], function(System, showController){
  System.module('SecurityEventsApp', function(SecurityEventsApp, System, Backbone, Marionette, $, _){

    SecurityEventsApp.Router = Marionette.AppRouter.extend({

      //controller: showController,

      appRoutes: {
        "complexEvent" : "addCompoundEvent",
        "complexEvents" : "showCompoundEvents"        
      }
      
    });

    System.addInitializer(function(){
      new SecurityEventsApp.Router({
        controller: showController
      });
    });

    System.on("employees:show", function(){
      System.navigate("employees");
      showController.showemployees();
    });
    
    
  });

  return System.SecurityEventsApp;
});

