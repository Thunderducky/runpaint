const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const secure = require('ssl-express-www')
const app = express()

app.use(secure)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../client/build')))
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

module.exports = app
