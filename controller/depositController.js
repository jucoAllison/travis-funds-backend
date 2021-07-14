const depositShema = require('../schema/depositingSchema');
const userSchema = require('../schema/userSchema');
const jwt = require('jsonwebtoken');

exports.postNewDepositForUser = async (req, res) => {
  const getUser = await userSchema.findOne({_id: req.verify._id});
  if (!getUser) {
    return res.status(404).json({
      err: true,
      msg: 'Found no user',
    });
  }
  try {
    if (getUser.accountBalance >= +req.body.amount) {
      const getDeposit = await new depositShema({
        amount: req.body.amount,
        owner: getUser._id,
        investedIn: req.body.investedIn,
        currentPrice: req.body.currentPrice,
        unit: req.body.unit,
        unitName: req.body.unitName,
      });
      const savedDeposit = await getDeposit.save();
      // now subtracting amount from accountBalance of the user and also adding to user totalDeposited
      const accountBalance = await +getUser.accountBalance - +req.body.amount;
      const totalDeposited = await +getUser.totalDeposited + +req.body.amount;

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

      return res.status(200).json({
        err: false,
        msg: 'Successfully deposited to your account',
        token,
      });
    } else {
     return res.status(401).json({
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


exports.getAllInvestments = async (req, res) => {
  try {
    const allDeposits = await depositShema.find({owner: req.verify._id})
    return res.status(200).json({
      err: false,
      msg: "All deposits",
      data: allDeposits
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      err: true,
      msg: 'Check your internet connection',
    });
  }
}

exports.getEachDepositInvestment = async(req,res) => {
  try {
    const eachDeposits = await depositShema.findOne({_id: req.params.ID})
    return res.status(200).json({
      err: false,
      msg: "Each deposit",
      data: eachDeposits
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      err: true,
      msg: 'Check your internet connection',
    });
  }
}