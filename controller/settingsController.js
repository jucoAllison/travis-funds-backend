const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = require('../schema/userSchema');

// modifiying user words
exports.changePassword = async (req, res) => {
  const {password, oldPassword} = req.body;
  if (password.length < 7) {
    return res.status(500).json({err: true, msg: 'password is weak'});
  }
  const user = await userSchema.findOne({_id: req.verify._id});
  const parsePassword = await bcrypt.compare(oldPassword, user.password);
  if (!parsePassword) {
    return res.status(500).json({err: true, msg: 'authentication failed'});
  }
  const hashPassword = await bcrypt.hash(password, 11);
  const updatePassword = await userSchema.findOneAndUpdate(
    {_id: user._id},
    {password: hashPassword},
    {new: true}
  );
  const token = await jwt.sign(
    {...updatePassword._doc, password: ''},
    process.env.TOKEN,
    {expiresIn: '30m'}
  );
  res
    .status(200)
    .json({msg: 'sucessfully changed password', token, err: false});
};

// modify bank details
exports.changeBank = async (req, res) => {
  const {accountNumber, accountName, bankName, routingNumber} = req.body;
  const user = await userSchema.findOne({_id: req.verify._id});
  const updateAccount = await userSchema.findOneAndUpdate(
    {_id: user._id},
    {accountNumber, accountName, bankName, routingNumber},
    {new: true}
  );
  const token = await jwt.sign(
    {...updateAccount._doc, password: ''},
    process.env.TOKEN,
    {expiresIn: '30m'}
  );
  res
    .status(200)
    .json({msg: 'bank details sucessfully updated', token, err: false});
};

exports.accountTransfer = async (req, res) => {
  try {
    const user = await userSchema.findOne({_id: req.verify._id});
    let message;
    if (user.enableTransfer) {
      message = 'account tranfer disenabled';
    } else {
      message = 'account tranfer enabled';
    }

    const update = await userSchema.findOneAndUpdate(
      {_id: req.verify._id},
      {enableTransfer: !user.enableTransfer},
      {new: true}
    );
    const token = await jwt.sign(
      {...update._doc, password: ''},
      process.env.TOKEN,
      {expiresIn: '30m'}
    );
    res
      .status(200)
      // .json({msg: 'account tranfer sucessfully updated', token, err: false});
      .json({msg: message, token, err: false});
  } catch (error) {
    console.log(error)
    res.status(500).json({error, err: true, msg: "server error"})
  }
};
