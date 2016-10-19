define(["app", "apps/reports/show/show_controller"], function(System, showController){
  System.module('ReportsApp', function(ReportsApp, System, Backbone, Marionette, $, _){

    ReportsApp.Router = Marionette.AppRouter.extend({
      appRoutes: {
        //"securityReports" : "securityReports",
        //"personsReports" : "personsReports",
        "systemReports" : "systemReports"
      }
    });

    var API = {
      financialReports: function(){
        showController.financialReports();
      },

      clientReports: function(a){
        showController.clientReports(a);
      },

      procurementReports: function(a){
        showController.procurementReports(a);
      },

      projectReports: function(a){
        showController.projectReports(a);
      },

      hrReports: function(a){
        showController.hrReports(a);
      },

      systemReports: function(a){
        showController.systemReports(a);
      }

    };

    System.on("employees:show", function(){
      System.navigate("employees");
      API.showemployees();
    });
    
    System.addInitializer(function(){
      new ReportsApp.Router({
        controller: API
      });
    });
  });

  return System.ReportsApp;
});

