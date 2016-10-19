require('jsclass');
var Class = require('jsclass/src/core').Class;
var Console = require('jsclass/src/console').Console;
var AbstractMapper = require("../data/core/datamapper").AbstractMapper;
var DataMap = require("../data/core/datamapper").DataMap;
var DomainObject = require("../data/core/datamapper").DomainObject;
var MapperRegistry = require("../data/core/mapperregistry").MapperRegistry;
var UoW = require("../data/core/unitofwork").UnitOfWork;
var Party = require("./core/party").Party;
var Action = require("./actionfoundry").Action;
var ProposedAction = require("./actionfoundry").ProposedAction;
var Measurement = require("./observationfoundry").Measurement;
var Observation = require("./observationfoundry").Observation;
var PhenomenonType = require("./observationfoundry").PhenomenonType;
var Phenomenon = require("./observationfoundry").Phenomenon;

var PatientMapper = new Class(AbstractMapper, {
  
   initialize: function() {
      this.callSuper();
   },

   loadDataMap: function (object) {
      this.domainClass = object.klass;
      this.dataMap = new DataMap(this.domainClass, 'patients');
      this.dataMap.addColumnMap('salutation', 'salutation', 'varchar');
      this.dataMap.addColumnMap('fname', 'firstName', 'varchar');
      this.dataMap.addColumnMap('gname', 'givenName', 'varchar');
      this.dataMap.addColumnMap('sname', 'surName', 'varchar');
      this.dataMap.addColumnMap('oname', 'otherName', 'varchar');
      this.dataMap.addColumnMap('opno', 'opno', 'varchar');
      this.dataMap.addColumnMap('ipno', 'ipno', 'varchar');
      this.dataMap.addColumnMap('dob', 'dob', 'varchar');
      this.dataMap.addColumnMap('gender', 'gender', 'varchar');
      this.dataMap.addColumnMap('blood_type', 'bloodType', 'varchar');
      this.dataMap.addColumnMap('marital_status', 'maritalStatus', 'varchar');
      this.dataMap.addColumnMap('nationality', 'nationality', 'varchar');
      this.dataMap.addColumnMap('identification', 'identification', 'varchar');
      this.dataMap.addColumnMap('photo', 'photo', 'varchar');
      this.dataMap.addColumnMap('cellphone', 'cellPhone', 'varchar');
      this.dataMap.addColumnMap('workphone', 'workPhone', 'varchar');
      this.dataMap.addColumnMap('postal_add', 'postalAddress', 'varchar');
      this.dataMap.addColumnMap('physical_add', 'physicalAddress', 'varchar');
      this.dataMap.addColumnMap('email', 'email', 'varchar');
      this.dataMap.addColumnMap('bill_id', 'billTo', 'varchar');
      this.dataMap.addColumnMap('bill_ref', 'billRef', 'varchar');
      this.dataMap.addColumnMap('kin_name', 'kinName', 'varchar');
      this.dataMap.addColumnMap('kin_rshp', 'kinRelationship', 'varchar');
      this.dataMap.addColumnMap('kin_cellphone', 'kinCellPhone', 'varchar');
      this.dataMap.addColumnMap('kin_otherphone', 'kinOtherPhone', 'varchar');
      this.dataMap.addColumnMap('kin_postal', 'kinPostalAddress', 'varchar');
      this.dataMap.addColumnMap('kin_physical', 'kinPhysicalAddress', 'varchar');
      this.dataMap.addColumnMap('health_name', 'healthName', 'varchar');
      this.dataMap.addColumnMap('health_occupation', 'healthOccupation', 'varchar');
      this.dataMap.addColumnMap('health_cellphone', 'healthCellPhone', 'varchar');
      this.dataMap.addColumnMap('health_otherphone', 'healthOtherPhone', 'varchar');
      this.dataMap.addColumnMap('health_postal', 'healthPostalAddress', 'varchar');
      this.dataMap.addColumnMap('health_physical', 'healthPhysicalAddress', 'varchar');
      this.dataMap.addColumnMap('emp_name', 'empName', 'varchar');
      this.dataMap.addColumnMap('emp_phone', 'empPhone', 'varchar');
      this.dataMap.addColumnMap('emp_add', 'empAddress', 'varchar');
      this.dataMap.addColumnMap('balance', 'bal', 'double');
      this.mapLoaded = true;
   }

});

var Patient = new Class(Party, {

   extend: {
      newInstance:function () {
         return new this('', '');
      },

      create:function (params) {
         var obj = new this(id, 'Patient');
         obj.markNew();
         //Include logic for data integrity and duplicates 
         return obj;
      },

      createWithId:function (params, cb) {
         var self = this;
         self.getNextId(function (id) {
            var obj = new self(id, 'Patient');
            obj.markNewId();
            obj.setPersonalData('', params.fname, params.gname, params.sname, params.oname, params.dob, params.gender, '', params.country, params.identification, 'person.png')
            obj.setContacts(params.cellphone, params.workphone, params.postal, params.physical, params.email)
            obj.setNextOfKinContact(params.kinname, params.kinrshp, params.kincellphone, params.kinotherphone, params.kinpostal, params.kinphysical)
            obj.setPrimaryHealthcareContact(params.healthname, params.healthoccupation, params.healthcellphone, params.healthotherphone, params.healthpostal, params.healthphysical)
            obj.setEmployerContact(params.empname, params.empphone, params.empaddress)
            obj.setDefaultBilling(params.insurer, params.refno)
            obj.setBalance(params.balbf)
            obj.setMedicalData(params.btype, params.history, function (pobj) {
               cb(pobj);
            })
            //obj.setAddress(address);
            //Include logic for data integrity and duplicates 
            
         })
      },

      update:function (params, cb) {
         var self = this;
         self.findObject(params.id, function (obj) {            
            obj.setPersonalData('', params.fname, params.gname, params.sname, params.oname, params.dob, params.gender, '', params.country, params.identification, 'person.png')
            obj.setContacts(params.cellphone, params.workphone, params.postal, params.physical, params.email)
            obj.setNextOfKinContact(params.kinname, params.kinrshp, params.kincellphone, params.kinotherphone, params.kinpostal, params.kinphysical)
            obj.setPrimaryHealthcareContact(params.healthname, params.healthoccupation, params.healthcellphone, params.healthotherphone, params.healthpostal, params.healthphysical)
            obj.setEmployerContact(params.empname, params.empphone, params.empaddress)
            obj.setDefaultBilling(params.insurer, params.refno)
            obj.bloodType = params.btype;
            console.log(params)
            obj.markDirty();
            cb(obj);
            
            /*obj.setMedicalData(params.btype, params.history, function (pobj) {
               cb(pobj);
            })*/
            
         })
      },
   },
  
   initialize: function(id, type) {
      this.callSuper('');
      this.id = id;
      this.type = type;
   },

   setPersonalData: function(salutation, firstName, givenName, surName, otherName, dob, gender, maritalStatus, nationality, identification, photo) {
      this.salutation = salutation;
      this.firstName = firstName;
      this.givenName = givenName;
      this.surName = surName;
      this.otherName = otherName;
      this.dob = dob;
      this.gender = gender;
      this.maritalStatus = maritalStatus;
      this.nationality = nationality;
      this.identification = identification;
      this.photo = photo;
   },

   setContacts: function(cellPhone, workPhone, postalAddress, physicalAddress, email) {
      this.cellPhone = cellPhone;
      this.workPhone = workPhone;
      this.postalAddress = postalAddress;
      this.physicalAddress = physicalAddress;
      this.email = email;
   },

   setSystemData: function(opno, ipno) {
      this.opno = opno;
      this.ipno = ipno;
   },

   setBalance: function(balance) {
      //this.balance = new Money(parseFloat(balance), Currency.GetCurrency('KES'));
      this.bal = balance;
   },

   setDefaultBilling: function(billTo, reference) {
      this.billTo = billTo;
      this.billRef = reference;
   },

   setNextOfKinContact: function(name, relationship, cellPhone, otherPhone, postalAddress, physicalAddress) {
      this.kinName = name;
      this.kinRelationship = relationship;
      this.kinCellPhone = cellPhone;
      this.kinOtherPhone = otherPhone;
      this.kinPostalAddress = postalAddress;
      this.kinPhysicalAddress = physicalAddress;
   },

   setPrimaryHealthcareContact: function(name, occupation, cellPhone, otherPhone, postalAddress, physicalAddress) {
      this.healthName = name;
      this.healthOccupation = occupation;
      this.healthCellPhone = cellPhone;
      this.healthOtherPhone = otherPhone;
      this.healthPostalAddress = postalAddress;
      this.healthPhysicalAddress = physicalAddress;
   },

   setEmployerContact: function(name, phone, address) {
      this.empName = name;
      this.empPhone = phone;
      this.empAddress = address;
   },

   setMedicalData: function(bloodType, histories, cb) {
      this.bloodType = bloodType;
      //History - Observations
      var self = this;
      var count = 0;
      histories.forEach(function(hx, index) { 
         Observation.recordHistory(self, hx.context, hx.phenomenonType, hx.phenomenon, hx.applicableDate, function (obj) {
            ++count;
            if (histories.length == count) {
               cb(self)
            }
         })
      })
      //Observation.recordHistory('Risk Factors', riskFactors, function (rfresults) {
   }

});

var Encounter = new Class(DomainObject, {

   extend: {
      newInstance:function () {
         return new this('', '');
      },

      create:function (patient, patientType, visitType) {
         var obj = new this('', patient, patientType, visitType, new Date(Date.now()));
         obj.markNew();
         //Include logic for data integrity and duplicates 
         return obj;
      },

      createWithId:function (patient, patientType, visitType, cb) {
         var self = this;
         self.getNextId(function (id) {
            var obj = new self(id, patient, patientType, visitType, new Date(Date.now()));
            obj.markNewId();
            //obj.setAddress(address);
            //Include logic for data integrity and duplicates 
            cb(obj);
         })
      },
   },
  
   initialize: function(id, patient, visitType, datetime) {
      this.id = id;      
      this.patientId = patient.id;
      this.patient = patient;
      this.patientType = patient.type;
      this.visitType = visitType;
      this.datetime = datetime;
      this.timestamp = Math.round(datetime.getTime()/1000);
      this.servicesRendered = new Array();
   },

   setBilling: function(billType, reference) {
      this.billType = billType;
      //this.billTo = billTo;
      this.billRef = reference;
      this.billFor = this.patientId;
   }

});

var QueueTrack = new Class(DomainObject, {

   extend: {
      newInstance:function () {
         return new this('', '');
      },

      create:function (encounter, location, department) {
         var obj = new this('', encounter, location, department, new Date(Date.now()));
         obj.markNew();
         //Include logic for data integrity and duplicates 
         return obj;
      },

      createWithId:function (encounter, location, department, cb) {
         var self = this;
         self.getNextId(function (id) {
            var obj = new self(id, encounter, location, department, new Date(Date.now()));
            obj.markNewId();
            //obj.setAddress(address);
            //Include logic for data integrity and duplicates 
            cb(obj);
         })
      },
   },
  
   initialize: function(id, encounter, location, department, datetime) {
      this.id = id;      
      this.encounterId = encounter.id;
      this.encounter = encounter;
      this.location = location;
      this.department = department;
      this.datetime = datetime;
      this.timestamp = Math.round(datetime.getTime()/1000);
   }

});

var Triage = new Class(Action, {

   extend: {
      newInstance:function () {
         return new this('', '');
      },

      beginSession:function (appointment, cb) {
         var self = this;
         self.getNextId(function (id) {
            var obj = new self(id, appointment, new Date(Date.now()));
            obj.markNewId();
            //obj.setAddress(address);
            //Include logic for data integrity and duplicates 
            cb(obj);
         })
      },

      completeSession:function (appointment, cb) {
         var self = this;
         self.getNextId(function (id) {
            var obj = new self(id, appointment, new Date(Date.now()));
            obj.markNewId();
            //obj.setAddress(address);
            //Include logic for data integrity and duplicates 
            cb(obj);
         })
      },
   },
  
   initialize: function(id, appointment, datetime) {
      this.id = id;   
      this.appointmentid = appointment.id;
      this.appointment = appointment;   
      this.patientId = appointment.patient.id;
      this.patient = appointment.patient;
      this.datetime = datetime;
      this.timestamp = Math.round(datetime.getTime()/1000);
      this.measurements = new Array();
   },

   addMeasurement: function(phenomenonType, quantity) {
      var self = this;
      Measurement.createWithId(this.patient, phenomenonType, quantity, function(measure){
         measure.setParent(self);
         self.measurements.push(measure);
      })
   }

});

var Consultation = new Class(Action, {

   extend: {
      newInstance:function () {
         return new this('', '');
      },

      beginSession:function (appointment, cb) {
         var self = this;
         self.getNextId(function (id) {
            var obj = new self(id, appointment, new Date(Date.now()));
            obj.markNewId();
            //obj.setAddress(address);
            //Include logic for data integrity and duplicates 
            cb(obj);
         })
      },

      completeSession:function (appointment, cb) {
         var self = this;
         self.getNextId(function (id) {
            var obj = new self(id, appointment, new Date(Date.now()));
            obj.markNewId();
            //obj.setAddress(address);
            //Include logic for data integrity and duplicates 
            cb(obj);
         })
      },
   },
  
   initialize: function(id, appointment, datetime) {
      this.id = id;
      this.encounterId = appointment.encounter.id; 
      this.encounter = appointment.encounter;  
      this.appointmentId = appointment.id;
      this.appointment = appointment;   
      this.patientId = appointment.patient.id;
      this.patient = appointment.patient;
      this.department = appointment.department;   
      this.datetime = datetime;
      this.timestamp = Math.round(datetime.getTime()/1000);
      this.measurements = new Array();
      this.observations = new Array();
      this.investigations = new Array();
      this.prescriptions = new Array();
      this.referrals = new Array();
   },

   recordMeasurement: function(phenomenonType, quantity, cb) {
      var self = this;
      Measurement.createWithId(this.patient, phenomenonType, quantity, function(object){
         object.setParent(self);
         self.measurements.push(object);
         cb(object);
      })
   },

   recordObservation: function(phenomenon, cb) {
      var self = this;
      Observation.createWithId(this.patient, phenomenon, function(object){
         object.setParent(self);
         self.observations.push(object);
         cb(object);
      })
   },

   requestInvestigation: function(test, cb) {
      var self = this;
      //test infers department
      Investigation.createWithId(this.appointment, test, function(object){
         object.setParent(self);
         self.investigations.push(object);
         cb(object);
      })
   },

   recordPrescription: function(prescriptionItems) {
      var self = this;
      //type infers department
      Prescription.createWithId(this.appointment, function(object){
         //object.setParent(self);
         prescriptionItems.forEach( function(item, index) {
            PrescriptionItem.createWithId(object, medication, dosage, route, frequency, duration, function(lineItem) {
               object.addLineItem(lineItem);

               if (prescriptionItems.length == ++index) {
                  self.prescriptions.push(object);
                  cb(object)
               };
            })
         });
      })
   },

   makeReferral: function(department, service, priority) {
      var self = this;
      //type infers department
      Appointment.createWithId(this.appointment, department, service, priority, function(object){
         object.setParent(self);
         self.referrals.push(object);
         cb(object);
      })
   },

   getTriage: function (cb) {
      Triage.findByEncounter(this.encounterId, function (object) {
         cb(object)
      })
   }

});

var PrescriptionItem = new Class(DomainObject, {

   extend: {
      newInstance:function () {
         return new this('', '');
      },

      create:function (prescription, medication, dosage, route, frequency, duration) {
         var obj = new this('', prescription, medication, dosage, route, frequency, duration);
         obj.markNew();
         //Include logic for data integrity and duplicates 
         return obj;
      },

      createWithId:function (prescription, medication, dosage, route, frequency, duration, cb) {
         var self = this;
         self.getNextId(function (id) {
            var obj = new self(id, prescription, medication, dosage, route, frequency, duration);
            obj.markNewId();
            //obj.setAddress(address);
            //Include logic for data integrity and duplicates 
            cb(obj);
         })
      },
   },
  
   initialize: function(id, prescription, medication, dosage, route, frequency, duration) {
      this.id = id; 
      this.prescription_id = prescription.id;
      this.prescription = prescription;     
      this.medication_id = medication.id;
      this.medication_name = medication.name;
      this.medication = medication;
      this.dosage_qty = dosage.quantity.amount;
      this.dosage_unit = dosage.unit.name;
      this.dosage = dosage;
      this.route = route;
      this.frequency = frequency;
      this.duration_qty = duration.quantity.amount;
      this.duration_unit = duration.unit.name;
      this.duration = duration;
   }

});

var Prescription = new Class(ProposedAction, {

   extend: {
      newInstance:function () {
         return new this('', '');
      },

      create:function (appointment) {
         var obj = new this('', appointment, new Date(Date.now()));
         obj.markNew();
         //Include logic for data integrity and duplicates 
         return obj;
      },

      createWithId:function (appointment, cb) {
         var self = this;
         self.getNextId(function (id) {
            var obj = new self(id, appointment, new Date(Date.now()));
            obj.markNewId();
            //obj.setAddress(address);
            //Include logic for data integrity and duplicates 
            cb(obj);
         })
      },
   },
  
   initialize: function(id, appointment, datetime) {
      this.id = id;      
      this.patientId = appointment.patient.id;
      this.patient = appointmentpatient;
      this.encounterId = appointment.encounter.id; 
      this.encounter = appointment.encounter;  
      this.appointmentId = appointment.id;
      this.appointment = appointment;
      this.physicianId = appointment.performer.id;
      this.physician = appointment.performer;
      this.datetime = datetime;
      this.timestamp = Math.round(datetime.getTime()/1000);
      this.lineItem = new Array();
   },

   addLineItem: function(prescriptionItem) {
      this.lineItem.push(prescriptionItem);
   }

});

module.exports.PatientMapper = PatientMapper;
module.exports.Patient = Patient;
module.exports.Encounter = Encounter;
module.exports.QueueTrack = QueueTrack;
module.exports.Triage = Triage;
module.exports.Consultation = Consultation;
module.exports.PrescriptionItem = PrescriptionItem;
module.exports.Prescription = Prescription;










