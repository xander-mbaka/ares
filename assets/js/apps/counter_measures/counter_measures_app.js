define(["app", "apps/counter_measures/show/show_controller"], function(System, showController){
  System.module('CounterMeasuresApp', function(CounterMeasuresApp, System, Backbone, Marionette, $, _){

    CounterMeasuresApp.Router = Marionette.AppRouter.extend({

      //controller: showController,

      appRoutes: {
        "counterTypes" : "counterMeasureTypes",
        "addCounter" : "addCounterMeasure",
        "counterMeasures" : "showCounterMeasures",
        "counterHistory" : "counterMeasureData"
      }
    });

    System.addInitializer(function(){
      new CounterMeasuresApp.Router({
        controller: showController
      });
    });

    System.on("employees:show", function(){
      System.navigate("employees");
      showController.showemployees();
    });
    
    
  });

  return System.CounterMeasuresApp;
});

