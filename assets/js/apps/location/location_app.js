define(["app", "apps/location/show/show_controller"], function(System, showController){
  System.module('LocationApp', function(LocationApp, System, Backbone, Marionette, $, _){

    LocationApp.Router = Marionette.AppRouter.extend({

      //controller: showController,

      appRoutes: {
        "addLocation" : "addLocation",
        "locations" : "showLocations",
        "locationsMap" : "showMap"
      }
    });

    System.addInitializer(function(){
      new LocationApp.Router({
        controller: showController
      });
    });

    System.on("employees:show", function(){
      System.navigate("addLocation");
      showController.showemployees();
    });
    
    
  });

  return System.LocationApp;
});

