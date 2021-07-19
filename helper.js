const userSchema = require('./schema/userSchema');

exports.getCurrentDate = () => {
  //  date structure = dd-mm--yy
  // let date = `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getYear()}`;
  let date = `${new Date().toLocaleDateString()}`;
  
  return date;
};

exports.checkUserID = async (req, res, next) => {
  try {
    const findID = await userSchema.findOne({_id: req.params.ID});
    // if(!findID) {
    //     res.status(404).json({msg: "found no user", err: true})
    // }
    req.user = findID;
    res.json(findID)
    next();
  } catch (error) {
    res.status(404).json({msg: 'found no user', err: true});
  }
};
