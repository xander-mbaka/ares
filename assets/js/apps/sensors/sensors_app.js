define(["app", "apps/sensors/show/show_controller"], function(System, showController){
  System.module('SensorsApp', function(SensorsApp, System, Backbone, Marionette, $, _){

    SensorsApp.Router = Marionette.AppRouter.extend({

      //controller: showController,

      appRoutes: {
        "sensorType" : "sensorTypes",
        "eventTypes" : "sensorEvents",
        "addSensor" : "addSensor",
        "sensors" : "showSensors",
        "sensorData" : "sensorData"
      }
    });

    System.addInitializer(function(){
      new SensorsApp.Router({
        controller: showController
      });
    });

    System.on("sensors:show", function(){
      System.navigate("sensors");
      showController.showSensors();
    });
    
    
  });

  return System.SensorsApp;
});

