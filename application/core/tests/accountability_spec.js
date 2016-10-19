require('jsclass');
JS.require('JS.Class');

var Accountability = require("../accountability"),
    should = require("chai").should(),
    _ = require("underscore");

describe("CORE_DOMAIN_TEST_001::Accountability", function () {
  var index;
  beforeEach(function () {
  });

  it("should create accountabilities", function () {
    //system accountability configuration ::=

    //test accountability type == purpose
    var appointment = new Accountability.ConnectedAccountabilityType('Appointment');
    var supervision = new Accountability.ConnectedAccountabilityType('Supervision');
    var patientCare = new Accountability.ConnectedAccountabilityType('PatientCare');

    //test party type == role
    var hospital = new Accountability.PartyType('Hospital');
    //hospital.addPrivilege({channels, view, commands, queries});
    var doctor = new Accountability.PartyType('Doctor');
    var nurse = new Accountability.PartyType('Nurse');
    var labtech = new Accountability.PartyType('Labtech');
    var patient = new Accountability.PartyType('Patient');
    var consultant = new Accountability.PartyType('Consultant');

    //test relationship rules == essence of the system [organization structure]
    appointment.addConnectionRule(hospital, doctor);
    appointment.addConnectionRule(hospital, consultant);
    patientCare.addConnectionRule(patient, doctor);
    patientCare.addConnectionRule(patient, consultant);
    supervision.addConnectionRule(doctor, doctor);
    supervision.addConnectionRule(consultant, doctor);
    supervision.addConnectionRule(consultant, consultant);

    //application instances :: Only viable after system is completely configured
    //test party/agent instances
    var mark = new Accountability.Party("Mark", doctor);
    var tom = new Accountability.Party("Tom", consultant);
    var mgonjwa = new Accountability.Party("Mgonjwa", patient);
    var vera = new Accountability.Party("Vera", nurse);
    var marc = new Accountability.Party("Marc", labtech);
    var stMarys = new Accountability.Party("St Mary's", hospital);

    var accountabilityInstances = new Array();
    //test accountability instances
    accountabilityInstances.push(Accountability.Accountability.create(stMarys, mark, appointment));
    accountabilityInstances.push(Accountability.Accountability.create(mgonjwa, tom, patientCare));
    //accountabilityInstances.push(Accountability.Accountability.create(mgonjwa, vera, patientCare));


    patientCare.addConnectionRule(patient, nurse);
    patientCare.addConnectionRule(patient, labtech);

    //accountabilityInstances.push(Accountability.Accountability.create(mgonjwa, vera, patientCare));

    //console.log(accountabilityInstances)
    //console.log(JSON.stringify(new Date()));
    console.log(hospital);
  });

});
/*var sale = new Accountability.ConnectedAccountabilityType('SaleAgreement');
var seller = new Accountability.PartyType('Vendor');
var buyer = new Accountability.PartyType('Customer');
sale.addConnectionRule(buyer, seller);
accountabilityInstances.push(Accountability.Accountability.create(buyer, seller, sale));*/