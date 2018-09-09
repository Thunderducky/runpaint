const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'))
})

module.exports = app
