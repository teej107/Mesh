const fileSetup = require('./file-setup');
const arguments = fileSetup.arguments();
const secrets = fileSetup.secret();

fileSetup.changedFiles().forEach(e => console.log(e));
if(fileSetup.changedFiles().length > 0)
    process.exit();

const port = arguments.port || 3000;

const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const session = require('express-session');
const path = require('path');

if(arguments.public)
{
    app.use(express.static(arguments.public));
    console.log('Serving public static files at: ' + path.resolve(arguments.public));
}
app.use(session({
    secret: secrets['session-secret'],
    saveUninitialized: false,
    resave: false
}));
app.use(require('body-parser').json());


const endpoints = require('./endpoint')();

for (let method in endpoints)
{
    let methodEndpoints = endpoints[method];
    for (let type in methodEndpoints)
    {
        let endpoint = methodEndpoints[type];
        app[method](endpoint.endpoint, endpoint.paramsCheck, endpoint.callback);
    }
}

const httpServer = app.listen(port, function () {
    console.log("Listening on port:", port);
});