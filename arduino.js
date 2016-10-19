/*var SerialPort = require("serialport");
var serialport = new SerialPort("/dev/cu.usbmodem1411");
serialport.on('open', function(){
  console.log('Serial Port Opend');
  serialport.on('data', function(data){
      console.log(data[0]);
  });
});*/
var Location = require("./domain/location").Location;
var AudioSensor = require("./domain/sensors").AudioSensor;
var EventDetecter = require("./domain/eventfoundry").LocationEventDetecter;
var house = new Location('Apt 602');

var DetecterOne = new EventDetecter(house);



var PatientMapper = require("./domain/objectfoundry").PatientMapper;

var five = require("johnny-five");
var board = new five.Board({ port: "COM24" });

board.on("ready", function() {
  var mic = new five.Sensor("A0");
  var motion = new five.Motion(7);
  var proximity = new five.Proximity({controller: "HCSR04", pin: 6});
  var vibration = new five.Sensor("A1");
  var weight = new five.Sensor({ pin: "A4", freq: 1000, threshold: 5 });

  weight.on("data", function(value) {
    console.log(this.raw);
    /*if(this.raw < 275 && status != 'empty') {
      status = 'empty';
      call();
    }
    if(this.raw > 460 && status != 'full') {
      status = 'full';
      tweet();
    }*/
  });

   var piezo = new five.Piezo(3);

  // Plays a song
  piezo.play({
    // song is composed by an array of pairs of notes and beats
    // The first argument is the note (null means "no note")
    // The second argument is the length of time (beat) of the note (or non-note)
    song: [
      ["A4", 1],
      ["G4", 1],
      ["A4", 1],
      ["G4", 1],
      [null, 1 / 4],
      ["A4", 1],
      ["G4", 1],
    ],
    tempo: 100
  });

  //var micled = new five.Led(11);
  //var motionled = new five.Led(9);

  vibration.on("data", function(value) {
   //console.log(value);
  });

  proximity.on("data", function() {
    //console.log("Proximity: ");
    //console.log("  cm  : ", this.cm);
    //console.log("  in  : ", this.in);
    //console.log("-----------------");
  });

  proximity.on("change", function() {
    //console.log("The obstruction has moved.");
  });

  //var micsensor = new AudioSensor('Sensor #001', house, mic, micled);

  //micsensor.addObserver(DetecterOne.method('analyzeEvent'))

  mic.on("data", function() {
    //console.log("mic: " + this.value);
    ///micled.brightness(this.value >> 2);
  });

  // "calibrated" occurs once, at the beginning of a session,
  motion.on("calibrated", function() {
    //console.log("calibrated");
  });

  // "motionstart" events are fired when the "calibrated"
  // proximal area is disrupted, generally by some form of movement
  motion.on("motionstart", function() {
    //motionled.brightness(true);
    //console.log("motionstart");
  });

  // "motionend" events are fired following a "motionstart" event
  // when no movement has occurred in X ms
  motion.on("motionend", function() {
    //motionled.brightness(false);
    //console.log("motionend");
  });

  // "data" events are fired at the interval set in opts.freq
  // or every 25ms. Uncomment the following to see all
  // motion detection readings.
  //motion.on("data", function(data) {
  //  console.log(data);
  //});
});