const express = require('express')
const app = express()

const path = require('path')
const session = require('express-session')
const hbs = require('hbs')
const ejs = require('ejs')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser');
const adminrouter = require('./routes/admin')
const {con} = require('./db/db')

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    secure : false,
  }));

app.set('view engine','ejs')
staticPath = path.join(__dirname + '/public/views')

app.set('views', __dirname + '/public/views/');
app.use('/public', express.static('public'));

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.use('/admin', adminrouter);

app.listen(port , (req,res) => {
    console.log(`Running on port ${port}`);
})