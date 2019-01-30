const express = require('express');
const loki = require('lokijs');
const uuid = require('uuid/v4');

const PORT = 5575;
const HOST = '192.168.1.12';

//App
const app = express();
const db = new loki('./data/loki.json');
const users = db.addCollection('users');
const logs = db.addCollection('logs');

app.post('/login', (req, res) => {
    console.log('/login');
    console.log(req.body);

    if (req.body.email === undefined || req.body.p_hash === undefined) {
        // bad request
        res.send({
            valid: false,
            error: 400,
            error_message: 'The request was bad, please make sure the email and HASH are included.'
        });
    }

    const result = users.find({email: req.body.email});
    if (result.p_hash !== req.body.p_hash) {
        // bad request
        res.send({
            valid: false,
            error: 469,
            error_message: 'Bad Password'
        });
    } else {
        res.send({
            valid: true,
            uuid: result.uuid
        });
    }

});

app.post('/signup', (req, res) => {
    console.log('/login');
    console.log(req.body);

    if (req.body.email === undefined || req.body.p_hash === undefined) {
        // bad request
        res.send({
            valid: false,
            error: 400,
            error_message: 'The request was bad, please make sure the email and HASH are included.'
        });
    }
    const result = users.find({email: req.body.email});
    if (result.length !== 0) {
        // bad request
        res.send({
            valid: false,
            error: 470,
            error_message: 'User already exists.'
        });
    }
    const p_uuid = uuid();
    users.insert(
        {
            email: req.body.email,
            p_hash: req.body.p_hash,
            uuid: p_uuid
        }
    );
    res.send({
        valid: true,
        uuid: p_uuid
    });
});

app.listen(PORT, HOST);
console.log('Running on http://%s:%d', HOST, PORT);