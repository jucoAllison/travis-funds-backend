const depositShema = require('../schema/depositingSchema');
const fundSchema = require('../schema/fundingAccount');
const userSchema = require('../schema/userSchema');
const jwt = require('jsonwebtoken');

exports.getAllUserForFX = async (req, res) => {
  try {
    const allUser = await userSchema.find();
    const refactor = allUser.map((v) => {
      return {...v._doc, password: ''};
    });
    return res.status(200).json({
      err: false,
      msg: 'All Users',
      data: refactor,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      err: true,
      msg: 'Check your internet connection',
    });
  }
};

exports.getEachUserForFX = async (req, res) => {
  try {
    const eachUser = await userSchema.findOne({_id: req.params.ID});
    const refactor = await {...eachUser._doc, password: ''};
    return res
      .status(200)
      .json({err: false, data: refactor, msg: 'successful'});
  } catch (error) {
    console.log(error);
    res.status(200).json({
      err: true,
      msg: 'Check your internet connection',
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      accountBalance,
      email,
      username,
      totalDeposited,
      totalWithdrawn,
      referrals,
      address,
      country,
    } = req.body;
    const eachUser = await userSchema.findOne({_id: req.params.ID});
    const update = await userSchema.findOneAndUpdate(
      {_id: eachUser._id},
      {
        first_name,
        last_name,
        accountBalance,
        email,
        username,
        totalDeposited,
        totalWithdrawn,
        referrals,
        address,
        country,
      },
      {new: true}
    );
    const refactor = await {...update._doc, password: ''};
    return res
      .status(200)
      .json({err: false, data: refactor, msg: 'successful'});
  } catch (error) {
    console.log(error);
    res.status(200).json({
      err: true,
      msg: 'Check your internet connection',
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const eachUser = await userSchema.findOne({_id: req.params.ID});
    const deleted = await userSchema.findOneAndDelete({_id: req.params.ID});

    return res
      .status(200)
      .json({url: '/dashboard', err: false, data: refactor, msg: 'successful'});
  } catch (error) {
    console.log(error);
    res.status(200).json({
      err: true,
      msg: 'Check your internet connection',
    });
  }
};

exports.processTransaction = async (req, res) => {
  try {
    if (req.body.name === 'Fund') {
      const findFund = await fundSchema.findOne({_id: req.params.ID});
      if (!findFund) {
        return res.status(200).json({
          err: true,
          msg: `Can't find any ${req.body.name}`,
        });
      }
      const calcBalance = await findFund.processed;
      const calcPending = await findFund.pending;
      const updateFund = await fundSchema.findOneAndUpdate(
        {_id: findFund._id},
        {
          pending: calcBalance ? true : false,
          processed: !calcBalance,
          canceled: false,
        },
        {new: true}
      );
      const FindUser = await userSchema.findOne({_id: updateFund.owner});
      const userBalance = FindUser.accountBalance + +updateFund.amount;
      const updateUserAccount = await userSchema.findOneAndUpdate(
        {_id: FindUser._id},
        {accountBalance: userBalance},
        {new: true}
      );

      return res.status(201).json({
        err: false,
        msg: 'Update successful',
      });
    } else if (req.body.name === 'Investment') {
      const findFund = await depositShema.findOne({_id: req.params.ID});
      if (!findFund) {
        return res.status(200).json({
          err: true,
          msg: `Can't find any ${req.body.name}`,
        });
      }
      const calcBalance = await findFund.processed;
      const calcPending = await findFund.pending;
      const updateFund = await depositShema.findOneAndUpdate(
        {_id: findFund._id},
        {
          pending: calcBalance ? true : false,
          processed: !calcBalance,
          canceled: false,
        },
        {new: true}
      );
      return res.status(201).json({
        err: false,
        msg: 'Update successful',
      });
    } else {
      return res.status(200).json({
        err: true,
        msg: 'No specification type',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({
      err: true,
      msg: 'Check your internet connection',
    });
  }
};

exports.cancleTransaction = async (req, res) => {
  try {
    if (req.body.name === 'Fund') {
      const findFund = await fundSchema.findOne({_id: req.params.ID});
      if (!findFund) {
        return res.status(200).json({
          err: true,
          msg: `Can't find any ${req.body.name}`,
        });
      }
      const calcBalance = await findFund.canceled;
      const calcPending = await findFund.pending;
      const updateFund = await fundSchema.findOneAndUpdate(
        {_id: findFund._id},
        {
          pending: calcBalance ? true : false,
          canceled: !calcBalance,
          processed: false,
        },
        {new: true}
      );
      return res.status(201).json({
        err: false,
        msg: 'Update successful',
      });
    } else if (req.body.name === 'Investment') {
      const findFund = await depositShema.findOne({_id: req.params.ID});
      if (!findFund) {
        return res.status(200).json({
          err: true,
          msg: `Can't find any ${req.body.name}`,
        });
      }
      const calcBalance = await findFund.canceled;
      const calcPending = await findFund.pending;
      console.log('calcBalance', calcBalance);
      console.log('calcPending', calcPending);
      const updateFund = await depositShema.findOneAndUpdate(
        {_id: findFund._id},
        {
          pending: calcBalance ? true : false,
          canceled: !calcBalance,
          processed: false,
        },
        {new: true}
      );
      return res.status(201).json({
        err: false,
        msg: 'Update successful',
      });
    } else {
      return res.status(200).json({
        err: true,
        msg: 'No specification type',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({
      err: true,
      msg: 'Check your internet connection',
    });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    if (req.body.name === 'Fund') {
      const deleteFund = await fundSchema.findOneAndDelete({
        _id: req.params.ID,
      });
      return res.status(200).json({
        err: true,
        msg: 'Delete Successful',
      });
    } else if (req.body.name === 'Investment') {
      const deleteFund = await depositShema.findOneAndDelete({
        _id: req.params.ID,
      });
      return res.status(200).json({
        err: true,
        msg: 'Delete Successful',
      });
    } else {
      return res.status(200).json({
        err: true,
        msg: 'No specification type',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({
      err: true,
      msg: 'Check your internet connection',
    });
  }
};
