const fundSchema = require('../schema/fundingAccount');
const depositSchema = require('../schema/depositingSchema');
const withdrawalSchema = require('../schema/withdrawalSchema');
const userSchema = require('../schema/userSchema');
const jwt = require('jsonwebtoken');

exports.fundMyAccount = async (req, res) => {
  try {
    // const isExisting = await userSchema.findOne({email});
    // if (existEmail) {
    //   return res.status(500).json({err: true, msg: 'email exits already'});
    // }
    const findUser = userSchema.findOne({_id: req.verify._id});

    // if(req.user.)

    const newFund = new fundSchema({
      amount: req.body.amount,
      owner: updateUser._id,
    });
    const saveFunds = await newFund.save();
    const token = await jwt.sign(
      {...findUser._doc, password: ''},
      process.env.TOKEN,
      {expiresIn: '15m'}
    );
    
    res.status(200).json({
      err: false,
      msg: 'successfully funded your account, pending for approval',
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      err: true,
      msg: 'Check your internet connection',
    });
  }
};

exports.get_fund_history = async (req, res) => {
  try {
    const getAll = await fundSchema.find({owner: req.params.ID});
    const getAllDeposit = await depositSchema.find({owner: req.params.ID});
    const allWithdrawal = await withdrawalSchema.find({owner: req.params.ID})
    const refactorGetAll = await getAll.map((v) => {
      return {...v._doc, name: 'Fund'};
    });
    const refactorAllDeposit = await getAllDeposit.map((v) => {
      return {...v._doc, name: 'Investment'};
    });
    const refactorAllWithdrawal = await allWithdrawal.map((v) => {
      return {...v._doc, name: 'Withdrawal'};
    });
    const allHistory = await [...refactorGetAll, ...refactorAllDeposit, ...refactorAllWithdrawal];
    res.status(200).json({
      err: false,
      // token,
      data: allHistory,
      msg: 'Account history',
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      err: true,
      msg: 'Check your internet connection',
    });
  }
};

exports.approveFund = async (req, res) => {
  try {
    const {which, fundID} = req.params;
    const findFund = await fundSchema.findOne({_id: fundID});
    console.log(findFund);
    console.log(findFund);
    console.log(findFund);
    if (!findFund) {
      return res.status(200).json({
        err: true,
        msg: "Can't find any fund with the id provided ",
      });
    } else {
      if (which === 'processed') {
        const findUser = await userSchema.findOne({_id: findFund.owner});
        const updateFund = await fundSchema.findOneAndUpdate(
          {_id: findFund._id},
          {pending: false, processed: true, canceled: false},
          {new: true}
        );
        // now updating the user with the Fund
        const calc = (await +findUser.accountBalance) + +updateFund.amount;
        const updateUser = await userSchema.findOneAndUpdate(
          {_id: updateFund.owner},
          {accountBalance: calc},
          {new: true}
        );
        const token = await jwt.sign(
          {...updateUser._doc, password: ''},
          process.env.TOKEN,
          {expiresIn: '15m'}
        );
        return res.status(200).json({
          err: false,
          msg: 'Successfully approved pending fund',
          token,
        });
      } else if (which === 'canceled') {
        // const findFund = await fundSchema.findOne({_id: fundID});
        const updateFund = await fundSchema.findOneAndUpdate(
          {_id: findFund._id},
          {pending: false, canceled: true, processed: false},
          {new: true}
        );
        return res.status(200).json({
          err: false,
          msg: 'Successfully canceled pending fund',
        });
      } else {
        return res.status(200).json({
          err: true,
          msg: 'required which is not correct not ',
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      err: true,
      msg: 'Check your internet connection',
    });
  }
};

exports.sendFundsToAnyUser = async (req, res) => {
  if (req.verify._id == req.body.address) {
    return res.status(200).json({err: true, msg: 'Operation not allowed'});
  }

  // update user amount
  try {
    if (req.verify.accountBalance <= +req.body.amount) {
      return res.status(200).json({
        err: true,
        msg: `You don't have effort balance ${req.verify.first_name}`,
      });
    }
    const calcAmount = (await req.verify.accountBalance) - +req.body.amount;
    const userAmount = await userSchema.findOneAndUpdate(
      {_id: req.verify._id},
      {accountBalance: calcAmount},
      {new: true}
    );
    const token = await jwt.sign(
      {...userAmount._doc, password: ''},
      process.env.TOKEN,
      {expiresIn: '15m'}
    );

    const getSendingUser = await userSchema.findOne({_id: req.body.address});

    if (!getSendingUser) {
      return res.status(200).json({
        err: true,
        msg: `Incorrect address`,
      });
    }

    // adding sent user the amount
    const sendingCalc = getSendingUser.accountBalance + +req.body.amount;
    const updatingSendingUser = await userSchema.findOneAndUpdate(
      {_id: getSendingUser._id},
      {accountBalance: sendingCalc},
      {new: true}
    );
    return res.status(200).json({
      err: false,
      msg: `Successfully made a transfer to ${updatingSendingUser.first_name}`,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      err: true,
      msg: 'Check your internet connection',
    });
  }
};
