const express = require('express');
const bodyParser = require('body-parser');
const loki = require('lokijs');
const uuid = require('uuid/v4');

const PORT = 8080;
const HOST = '127.0.0.1';

//App
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

const db = new loki('./data/loki.json');
db.autosave = true;
const users = db.addCollection('users');
const logs = db.addCollection('logs');

app.get('/', (req, res) => {
    res.send("Ziegler");
});

app.post('/login', (req, res) => {
    console.log('/login');

    if (req.body.email === undefined || req.body.p_hash === undefined) {
        // bad request
        res.send({
            valid: false,
            error: 400,
            error_message: 'The request was bad, please make sure the email and HASH are included.'
        });
        return;
    }

    const result = users.find({email: req.body.email});
    console.log(result);
    if (result.length !== 0 && result[0].p_hash == req.body.p_hash) {
        res.send({
            valid: true,
            uuid: result[0].uuid
        });
    } else {
        res.send({
            valid: false,
            error: 469,
            error_message: 'Bad Password'
        });
    }

});

app.post('/signup', (req, res) => {
    console.log('/login');
    
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
        return;
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

app.put('/:userId/log', (req, res) => {
    console.log(`${req.params.userId} logged a weather event.`);
    console.log(req);
    
    logs.insertOne({
        uuid: req.params.userId,
        weather: req.query.weather,
        temp: req.query.temp
    });

    res.send({
        valid: true
    })
});

app.get('/:userId/logs', (req, res) => {
    const results = logs.find({uuid : req.params.userId});
    res.send(results);
});

app.listen(PORT);
console.log(`Running on ${PORT}`);