const mongoose = require('mongoose');
const helper = require('../helper');

const CreatingDeposit = new mongoose.Schema({
  requestWithdrawal: {type: Boolean, required: true, default: false},
  isWithdrawal: {type: Boolean, required: true, default: false},
  pending: {type: Boolean, required: true, default: true},
  investedIn: {type: String},
//   investedIn: {type: String},
  processed: {type: Boolean, required: true, default: false},
  canceled: {type: Boolean, required: true, default: false},
  amount: {type: String, required: true},
  owner: {type: mongoose.Schema.Types.ObjectId, required: true},
  date: {
    type: String,
    required: true,
    default:
      new Date().getMonth() +
      '/' +
      new Date().getDate() +
      '/' +
      new Date().getYear(),
  },
});

module.exports = mongoose.model('Deposits', CreatingDeposit);
