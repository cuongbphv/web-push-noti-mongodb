const webpush = require('web-push');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const api = require('./routes/api');
const path = require('path');

// Config for web-push
const publicVapidKey = 'publicVapidKey';
const privateVapidKey = 'privateVapidKey';
webpush.setVapidDetails('mailto:your-email@example.com', publicVapidKey, privateVapidKey);

// Config for Express 
const app = express();
const port = process.env.PORT || 9000;
const User = require('./models/User');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(api);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './views')
app.set('view engine', 'pug');

mongoose.connect('mongodb://localhost/taskDb?replicaSet=rs');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error:'));

db.once('open', () => {
    app.listen(port, () => {
        console.log('Server running on port 9000');
    });
    const taskCollection = db.collection('tasks');
    const changeStream = taskCollection.watch();
    changeStream.on('change', (change) => {
        User.find({}, function (err, users) {
            console.info(users[0])
            console.info("Change Data", change);
            webpush.sendNotification({
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
                userVisibleOnly: true,
                endpoint: users[0].endpoint,
                keys:
                {
                    p256dh: users[0].keys.p256dh,
                    auth: users[0].keys.auth
                }
            }, JSON.stringify(change)).catch(error => {
                console.error(error.stack);
            });
        });
    });
});

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = Buffer.from(base64, 'base64').toString('ascii');
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}