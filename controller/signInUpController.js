const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = require('../schema/userSchema');

// creating new user || signUP
exports.signUP = async (req, res) => {
  const {email, password, referral} = req.body;
  if (password.length < 7) {
    return res.status(500).json({err: true, msg: 'password is weak'});
  }
  // finding if email exists
  const existEmail = await userSchema.findOne({email});
  if (existEmail) {
    return res.status(500).json({err: true, msg: 'email exits already'});
  }
  const hashPassword = await bcrypt.hash(password, 11);
  const newUser = new userSchema({
    password: hashPassword,
    email,
    referral,
  });


  const saveUser = await newUser.save();
  // now getting the referral and crediting her 10usd
  // if(referral.length )
  const foundrRef = await userSchema.findOne({username: referral})
  if(!foundrRef){
    res.status(201).json({
      err: false,
      msg: 'sign-up successful, please continue',
      // token,
      _id: saveUser._id,
      isVerify: saveUser.verifyEmail,
    });
  } 
  const calcRefBal = await foundrRef.accountBalance + 10
   const updateRef = await userSchema.findOneAndUpdate({_id: foundrRef._id}, {accountBalance: calcRefBal}, {new: true})
  res.status(201).json({
    err: false,
    msg: 'sign-up successful, please continue',
    // token,
    _id: saveUser._id,
    isVerify: saveUser.verifyEmail,
  });
};

// login || signIN
exports.signIN = async (req, res) => {
  try {
    const {username, email, password, type} = req.body;

    const check = (type) => {
      if (type === 'email') {
        return email;
      } else {
        return username;
      }
    };
    const getEmail = await userSchema.findOne({[type]: check(type)});
    // console.log()
    if (!getEmail) {
      return res
        .status(500)
        .json({err: true, msg: 'Authentication failed'});
    }
    const parsePassword = await bcrypt.compare(password, getEmail.password);
    if (!parsePassword) {
      return res
        .status(500)
        .json({err: true, msg: 'Authentication failed'});
    }
    const token = await jwt.sign(
      {...getEmail._doc, password: ''},
      process.env.TOKEN,
      {expiresIn: '15m'}
    );

    // let url
    if (!getEmail.username) {
      // url = "/auth/verify"
      return res.status(200).json({
        err: false,
        url: '/auth/verify',
        _id: getEmail._id,
        msg: 'authentication successfull, account is not activated',
      });
    } else if (getEmail.isAccountActivated === false) {
      // url = "/auth/activate"
      return res.status(200).json({
        err: false,
        url: '/auth/activate',
        _id: getEmail._id,
        msg: 'authentication successfull, account is not activated',
      });
    } else {
      return res.status(201).json({
        err: false,
        msg: 'authentication successful. Redirecting, please wait',
        token,
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

// update profile
// : https://www.binance.com/bapi/composite/v1/public/marketing/symbol/list
exports.updateProfile = async (req, res) => {
  try {
    const _id = req.user._id;
    const {first_name, last_name, username, address, country, city} = req.body;
    // finding if username exists because username should be unique
    const existUsername = await userSchema.findOne({username});
    if (existUsername) {
      return res.status(500).json({err: true, msg: 'username exits already'});
    }

    const updateUser = await userSchema.findOneAndUpdate(
      {_id},
      {first_name, last_name, username, address, city, country},
      {new: true}
    );
    res.status(201).json({
      msg: 'updated profile successfully',
      err: false,
      _id: updateUser._id,
    });
    const random = Math.random().toString().split('.')[1];
    const another = Math.random().toString().split('.')[1];
    const mixxing = Math.random().toString().split('.')[1];
    const ID = req.user._id;
    // const username = username
    const name = `${first_name}-${last_name}`;
    // sending email for verifying account email
    // sending email for verifying account email
    // sending email for verifying account email
    // sending email for verifying account email

    // email url for activating account is
    // "/activate-account/:random/:name/:username/:ID/:another"
  } catch (error) {
    console.log(error);
    res.status(500).json({msg: 'Check your internet connection', err: true});
  }
};

// activating user Email, this is to be activataved from email sent to the user from his email address,
exports.activeEmail = async (req, res) => {
  const updated = await userSchema.findOneAndUpdate(
    {_id: req.user._id},
    {isAccountActivated: true},
    {new: true}
  );
  // now redirecting the url to congratulation page where the user will continue and then signUp
  res.redirect('http://localhost:3000' + '/auth/login');
};

// getting all users
exports.getAllUsers = async (req, res) => {
  const users = await userSchema
    .find()
    .select(
      'accountBalance verifyEmail isAccountActivated availableDeposit totalEarning totalDeposited totalWithdrawn totalPending signUpDate tfa address city country _id username first_name last_name upline email'
    );
  res.status(200).json({
    length: users.length,
    err: false,
    data: users,
    msg: 'all users avaiable',
  });
};

// admin deleting any user
exports.deleteUser = async (req, res) => {
  const deletedUser = await userSchema.findOneAndDelete({_id: req.user._id});
  res
    .status(200)
    .json({err: false, msg: 'deteled user successfully', data: deletedUser});
};
