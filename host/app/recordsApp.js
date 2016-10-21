var Patient = require("../../domain/objectfoundry").Patient;
var Observation = require("../../domain/observationfoundry").Observation;

module.exports = function (UoW) {
    var exported = {};

    var someFunction = function (done) {
        //.. code here..//
        if (typeof done === "function") {
            done(null, true);
        }
    };
    // export the function
    exported.someFunction = someFunction;

    var apicalls = function (app) {
        app.get("/module/someFunction", function (req, res) {
             res.header("Content-Type", "application/json");

             someFunction(function (err, response) {
                 if (err) return res.send(JSON.stringify(err));
                 res.send(JSON.stringify(response));
             });
        });
    };
    exported.apicalls = apicalls;

    var socketcalls = function (socket) {
        socket.on('record:add', function (data) {
            //UoW.newCurrent();
            var UnitOfWork = UoW.newCurrent();
            //session.uow.new();
            //session.uow = UoW.newCurrent();

            Patient.createWithId(data, function (object) {// (context/session, data, fallback)
                //session.uow.commit();
                UnitOfWork.commit(function (ack) {
                    if (ack) {
                        socket.emit('record:created', object);
                    } else {
                        //ack.rollback
                        socket.emit('record:error', {error: 'Record could not be saved!'});
                    }
               });              
            })
        });

        socket.on('record:update', function (data) {
            UoW.newCurrent();
            var UnitOfWork = UoW.getCurrent();

            Patient.update(data, function (object) {
                UnitOfWork.commit(function (ack) {
                    if (ack) {
                        socket.emit('record:updated', object);
                    } else {
                        socket.emit('record:error', {error: 'Record could not be saved!'});
                    }
               });                
            })
        });

        socket.on('records:all', function (data) {
            Patient.findAll(function (objects) {
                socket.emit('records:all', objects);
            })
        });

        socket.on('record:get', function (data) {
            Patient.findObject(data.id, function (object) {
                socket.emit('record:file', object);
            })
        });

        socket.on('record:getHistory', function (data) {

            Observation.getHistory(data.id, function (objects) {
                socket.emit('record:history', objects);
                console.log(objects.length+' - ')
                console.log(new Date(Date.now()))
            })
        });

        socket.on('record:delete', function (data) {
            UoW.newCurrent();
            var UnitOfWork = UoW.getCurrent();

            Patient.findObject(data.id, function (object) {
                object.markRemoved();
                UnitOfWork.commit(function (ack) {
                    if (ack) {
                        socket.emit('record:deleted', object);
                    } else {
                        socket.emit('record:error', {error: 'Record could not be deleted!'});
                    }
               });  
            })
        });

        socket.on('observation:add', function (data) {
            UoW.newCurrent();
            var UnitOfWork = UoW.getCurrent();

            console.log(data)

            Patient.findObject(data.patientId, function (object) {
                Observation.recordHistory(object, data.context, data.phenomenonType, data.phenomenon, data.applicableDate, function (obj) {
                    //obj.uiIndex = data.uiIndex;
                    UnitOfWork.commit(function (ack) {
                        if (ack) {
                            socket.emit('observation:added', obj);
                        } else {
                            socket.emit('record:error', {error: 'Observation entry could not be saved!'});
                        }
                   });
                    
                })
            })
        });

        socket.on('observation:delete', function (data) {
            Observation.findObject(data.id, function (object) {
                object.markRemoved();
                UnitOfWork.commit(function (ack) {
                    if (ack) {
                        socket.emit('observation:deleted', object);
                    } else {
                        socket.emit('record:error', {error: 'Observation entry could not be deleted!'});
                    }
               });  
            })
        });
    };
    exported.socketcalls = socketcalls;

    return exported;
}