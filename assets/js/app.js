define(["marionette", "socketio", "sweetalert"], function(Marionette, io){
  var System = new Marionette.Application();

  window.momentum = System;

  /*var coreURL = window.location.href.split(window.location.pathname);

  System.coreRoot = coreURL[0];
  
  //Socket.IO issue with the URL
  */

  System.coreRoot = "http://localhost:3050";
  //System.coreRoot = "http://192.168.1.171:3000";
  System.cache = {};

  var checkLogin = function(callback) {
    $.get(System.coreRoot + '/session', function(user) {
      if (user) {
        //var user = JSON.parse(result);
        if (user.id) {
          //alert(JSON.stringify(user));
          return callback(user);
        }else{
          return callback(false);
        }
      }else{
        return callback(false);
      }   
    });
  };

  var runApplication = function(data, options) {
    if (data) {
      //alert(JSON.stringify(data));
      System.trigger("menu:show", data);
    } else {
      System.trigger("login:show");
    }
    Backbone.history.start();
  };

  System.addRegions({
    menuRegion: "#menu",
    contentRegion: "#content"
  });

  System.navigate = function(route,  options){
    options || (options = {});
    Backbone.history.navigate(route, options);
  };  

  System.getCurrentRoute = function(){
    return Backbone.history.fragment;
  };

  System.on("initialize:after", function(){
    if(Backbone.history){
      require([
        "apps/login/login_app",
        "apps/menu/menu_app",
        "apps/security/security_app",
        "apps/location/location_app",
        "apps/sensors/sensors_app",
        "apps/counter_measures/counter_measures_app",
        "apps/security_event/security_event_app",
        "apps/people/people_app",
        "apps/tools/tools_app",
        "apps/reports/reports_app"
      ], function () {
        //Backbone.history.start();//{ pushState: true, root: "/ecomadmin/frontend/" }
        checkLogin(runApplication);

        System.socket = io.connect(System.coreRoot);
        //System.trigger("menu:show");
        //if(System.getCurrentRoute() === ""){
          //System.trigger("dash:show");
        //}
      });
    }
  });

  return System;
});