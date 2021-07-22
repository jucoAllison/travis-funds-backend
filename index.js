// const { urlencoded } = require("express");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.status(200).json({msg: 'hello world'});
});

app.use('/user', require('./api/signInUp'));
app.use('/modify', require('./api/settings'));
app.use('/proxy', require('./api/proxy'));
app.use('/user/accounts/funds', require('./api/fund'));
app.use('/user/activity/investment', require('./api/deposit'));
app.use('/user/activity/withdrawal', require('./api/withdrawal'));
// app.use('/user/activity/withdrawal', require('./api/withdrawal'));
app.use("/admin_side/management/update/user", require("./api/adminSide"))

mongoose
  .connect(
    "mongodb+srv://new_user01:new_user01@cluster0.0lloz.mongodb.net/FCXTRADE?retryWrites=true&w=majority",
    // 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false',
    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}
  )
  .then(() => {
    let port = process.env.PORT;
    app.listen(port, () => console.log('app started at port' + ' ' + port));
  })
  .catch((err) => console.log('start server'));

// HANDLING any other errors like when the request hits an undefined route
app.use((req, res, next) => {
  const error = new Error('invalid request');
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    err: true,
    error: {
      message: error.message,
    },
  });
});

// main email from adminRitomanchi@gmail.com
