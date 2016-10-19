module.exports = function () {
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

    var socketcalls = function (io) {
        io.on("connection", function (socket) {
            socket.on('module-someFunction', function () {
                someFunction(function (err, response) {
                    if (err) return socket.emit('module-someFunction', err);
                    socket.emit('module-someFunction', response);
                });
            });
        });
    };
    exported.socketcalls = socketcalls;

    return exported;
}