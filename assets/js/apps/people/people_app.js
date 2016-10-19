define(["app", "apps/people/show/show_controller"], function(System, showController){
  System.module('PeopleApp', function(PeopleApp, System, Backbone, Marionette, $, _){

    PeopleApp.Router = Marionette.AppRouter.extend({

      //controller: showController,

      appRoutes: {
        "addVisitor" : "addVisitor",
        "addStaff" : "addStaff",
        "personRegistry" : "personRegistry",
        "screenList" : "screenList",
        "appointments" : "appointments",
        "checkIn" : "checkIn",
        "checkOut" : "checkOut",
        "verifyCredentials" : "verifyAccess"
      }

    });

    System.addInitializer(function(){
      new PeopleApp.Router({
        controller: showController
      });
    });

    System.on("employees:show", function(){
      System.navigate("employees");
      showController.showemployees();
    });
    
    
  });

  return System.PeopleApp;
});

