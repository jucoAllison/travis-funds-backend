const fundSchema = require('../schema/fundingAccount');
const userSchema = require('../schema/userSchema');
const jwt = require('jsonwebtoken');

exports.fundMyAccount = async (req, res) => {
  try {
    // const isExisting = await userSchema.findOne({email});
    // if (existEmail) {
    //   return res.status(500).json({err: true, msg: 'email exits already'});
    // }
    // const findUser = userSchema.findOne({_id :})

    // if(req.user.)

    if (!req.user.investingAmount) {
      if (+req.body.amount > '99') {
        const calc = +req.body.amount + +req.body.amount * 0.2;
        const updateUser = await userSchema.findOneAndUpdate(
          {_id: req.user._id},
          {investingAmount: calc},
          {new: true}
        );

        const newFund = new fundSchema({
          amount: req.body.amount,
          owner: updateUser._id,
        });
        const saveFunds = await newFund.save();
        const token = await jwt.sign(
          {...updateUser._doc, password: ''},
          process.env.TOKEN,
          {expiresIn: '15m'}
        );
        res.status(200).json({
          err: false,
          msg: 'successfully funded your account, pending for approval',
          token,
        });
      } else {
        return res
          .status(401)
          .json({err: true, msg: "Can't fund with this amount"});
      }
    } else {
      if (+req.body.amount > Math.floor(+req.user.investingAmount) - 1) {
        const calc = +req.body.amount + +req.body.amount * 0.2;
        const updateUser = await userSchema.findOneAndUpdate(
          {_id: req.user._id},
          {investingAmount: calc},
          {new: true}
        );

        const newFund = await new fundSchema({
          amount: req.body.amount,
          owner: updateUser._id,
        });
        const token = await jwt.sign(
          {...updateUser._doc, password: ''},
          process.env.TOKEN,
          {expiresIn: '15m'}
        );
        const saveFunds = await newFund.save();
        res.status(200).json({
          err: false,
          token,
          msg: 'successfully funded your account, pending for approval',
        });
      } else {
        return res
          .status(401)
          .json({err: true, msg: "Can't fund with this amount"});
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

exports.get_fund_history = async (req, res) => {
  try {
    const getAll = await fundSchema.find({owner: req.user._id});
    res.status(200).json({
      err: false,
      // token,
      data: getAll,
      msg: 'successfully funded your account, pending for approval',
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
