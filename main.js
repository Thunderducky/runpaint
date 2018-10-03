const chalk = require('chalk')
const path = require('path')
const app = require('./server/app')
const express = require('express')
const PORT = process.env.PORT || 3001

app.listen(PORT, () =>
  console.log(chalk.bgBlue(`Now listening on PORT :${PORT}`)) //eslint-disable-line no-console
)
