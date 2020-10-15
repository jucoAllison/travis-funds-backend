const mongoose = require('mongoose');
const helper = require('../helper');

const newUser = new mongoose.Schema({
  username: String,
  first_name: String,
  last_name: String,
  accountBalance: {type: Number, required: true, default: 0},
  email: String,
  verifyEmail: {type: Boolean, required: true, default: false},
  isAccountActivated: {type: Boolean, required: true, default: false},
  password: String,
  availableDeposit: {type: Number, default: 0},
  totalEarning: {type: Number, default: 0},
  totalDeposited: {type: Number, required: true, default: 0},
  totalWithdrawn: {type: Number, required: true, default: 0},
  totalPending: {type: Number, required: true, default: 0},
  signUpDate: {type: String, required: true, default: helper.getCurrentDate()},
  lastLogin: String,
  lastLoginHolder: String,
  tfa: {type: Boolean, required: true, default: false},
  referrals: {type: Array, required: true, default: []},
  upline: String,
  activeReferrals: {type: Number, required: true, default: 0},
  referralEarnings: {type: Number, required: true, default: 0},
  bitcoinAddress: {type: String, default: null},
  address: {type: String, default: null},
  city: {type: String, default: null},
  country: {type: String, default: null},
  enableTransfer: {type: Boolean, required: true, default: false},
  accountNumber: String,
  accountName: String,
  bankName: String,
  routingNumber: String,

  investingAmount: Number,
});

module.exports = mongoose.model('User_Schema', newUser);
