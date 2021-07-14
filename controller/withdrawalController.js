const withdrawalSchema = require('../schema/depositingSchema');
const userSchema = require('../schema/userSchema');
const jwt = require('jsonwebtoken');
const depositShema = require('../schema/depositingSchema');

exports.post_new_withdrawal = async (req, res) => {
  try {
    const postNewWithdrawal = await withdrawalSchema({
      owner: req.verify._id,
      amount: req.body.amount,
    });
    const savedWithdrawal = await postNewWithdrawal.save();
    // updateing user balance
    const eachDeposit = await depositShema.findOne({_id: req.params.ID});
    if (!eachDeposit) {
      return res.status(404).json({err: false, msg: 'No deposits found'});
    }
    const calcUnit = eachDeposit.unit - req.body.unit;
    // updating the deposit where the profit is coming from
    depositShema.findOneAndUpdate(
      {_id: req.verify._id},
      {unit: calcUnit, amount: req.body.amount},
      {new: true}
    );
    return res
      .status(200)
      .json({err: false, msg: 'Withdrawal pending waiting for approval'});
  } catch (error) {
    console.log(error);
    res.status(400).json({
      err: true,
      msg: 'Check your internet connection',
    });
  }
};
