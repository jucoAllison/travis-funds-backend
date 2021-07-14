const mongoose = require('mongoose');
const helper = require('../helper');

const CreatingWithdrawal = new mongoose.Schema({
  requestWithdrawal: {type: Boolean, required: true, default: true},
  isWithdrawal: {type: Boolean, required: true, default: false},
  pending: {type: Boolean, required: true, default: true},
  withdrawalAmount: String,
  currentPrice: String,
  investedIn: {type: String},
//   investedIn: {type: String},
  processed: {type: Boolean, required: true, default: false},
  canceled: {type: Boolean, required: true, default: false},
  amount: {type: String, required: true},
  owner: {type: mongoose.Schema.Types.ObjectId, required: true},
  unit: String,
  unitName: String,
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

module.exports = mongoose.model('Deposits', CreatingWithdrawal);
