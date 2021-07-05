const depositShema = require('../schema/depositingSchema');
const userSchema = require('../schema/userSchema');
const jwt = require('jsonwebtoken');

exports.postNewDepositForUser = async (req, res) => {
  const getUser = userSchema.findOne({_id: req.verify_id});
  if (!getUser) {
    return res.status(404).json({
      err: true,
      msg: 'Found no user',
    });
  }
  try {
    if (+getUser.accountBalance > +req.body.amount) {
      const getDeposit = await new depositShema({
        amount: req.body.amount,
        owner: getUser._id,
        investedIn: req.body.investedIn,
      });
      const savedDeposit = await getDeposit.save();
      // now subtracting amount from accountBalance of the user and also adding to user totalDeposited
      const accountBalance = +getUser.accountBalance - +req.body.amount;
      const totalDeposited = +getUser.totalDeposited + +req.body.amount;

      const updatingUser = await userSchema.findOneAndUpdate(
        {_id: getUser._id},
        {
          accountBalance,
          totalDeposited,
        },
        {new: true}
      );

      const token = await jwt.sign(
        {...updatingUser._doc, password: ''},
        process.env.TOKEN,
        {expiresIn: '15m'}
      );

      res.status(200).json({
        err: false,
        msg: 'successfully deposited to your account',
        token,
      });
    }
    {
      res.status(401).json({
        err: true,
        msg: 'Insufficient balance',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      err: true,
      msg: 'Check your internet connection',
    });
  }
};
