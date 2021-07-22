const withdrawalSchema = require('../schema/withdrawalSchema');
const userSchema = require('../schema/userSchema');
const jwt = require('jsonwebtoken');
const depositShema = require('../schema/depositingSchema');

exports.post_new_withdrawal = async (req, res) => {
  try {
    const eachDeposit = await depositShema.findOne({_id: req.params.ID});
    if (!eachDeposit) {
      return res.status(404).json({err: true, msg: 'No deposits found'});
    }
    if(+eachDeposit.unit < +req.body.unit){
      return res.status(200).json({err: true, msg: 'Insuficient balance'})
    }
    if(+eachDeposit.amount < +req.body.amount){
      return res.status(200).json({err: true, msg: 'Insuficient balance'})
    }
    
    const calcAmount = await +eachDeposit.amount - +req.body.amount
    const calcUnitRemaining = await +eachDeposit.unit - +req.body.unit

    const updatedDeposit = await depositShema.findOneAndUpdate(
      {_id: req.params.ID},
      {unit: calcUnitRemaining, amount: calcAmount, requestWithdrawal: true, pending: true},
      {new: true}
    );
    const postNewWithdrawal = await withdrawalSchema({
      owner: req.verify._id,
      depositID: req.params.ID,
      amount: req.body.amount,
      unit: req.body.unit,
      unitName: eachDeposit.unitName,
    });
    const savedWithdrawal = await postNewWithdrawal.save();
    return res
      .status(200)
      .json({err: false, data: updatedDeposit, msg: 'Withdrawal pending waiting for approval'});

  } catch (error) {
    console.log(error);
    res.status(400).json({
      err: true,
      msg: 'Check your internet connection',
    });
  }
};


exports.getEach = async (req,res) => {
  try {
    const allWithdrawal = await withdrawalSchema.find({depositID: req.params.ID})
    return res.status(200).json({err: false, msg: "All withdrawal", data: allWithdrawal})
  } catch (error) {
    console.log(error);
    res.status(400).json({
      err: true,
      msg: 'Check your internet connection',
    });
  }
}