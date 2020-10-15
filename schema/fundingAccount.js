const mongoose = require('mongoose');
const helper = require('../helper');

const CreatingFunding = new mongoose.Schema({
    pending: {type: Boolean, required: true, default: true},
    processed: {type: Boolean, required: true, default: false},
    canceled: {type: Boolean, required: true, default: false},
    amount: {type: String, required: true},
    owner: {type: mongoose.Schema.Types.ObjectId, required: true},
    date: {type: String, required: true,  default: new Date().getMonth() + "/" +  new Date().getDate()+"/"+ new Date().getYear()}
});

module.exports = mongoose.model('Funding', CreatingFunding);
