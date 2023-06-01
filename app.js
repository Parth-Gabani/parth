const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
const {con} = require('./db/db')

const path = require('path')
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine','ejs')
staticPath = path.join(__dirname + '/public/views')




app.set('views', __dirname + '/public/views/');
app.use('/public', express.static('public'));
const xlsx = require('xlsx')
app.get('/',(req,res)=>{
  res.render('demo')
})

const fs = require('fs');

app.post('/submit-form', (req, res) => {
  const { name, email } = req.body;

  const sql = `INSERT INTO contacts (name, email) VALUES (?, ?)`;
  con.query(sql, [name, email], (error, results) => {
    if (error) throw error;

    const workbook = xlsx.readFile('contacts.xlsx');
    const worksheet = workbook.Sheets['Contacts'];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    data.push([name, email]);
    const updatedWorksheet = xlsx.utils.aoa_to_sheet(data);
    workbook.Sheets['Contacts'] = updatedWorksheet;
    xlsx.writeFile(workbook, 'contacts.xlsx');

    res.send('Form submitted successfully');
  });
});


app.listen(5000 , (req,res) => {
  console.log(`Running on port 5000`);
})