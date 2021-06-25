const userSchema = require('./schema/userSchema');

module.exports = async (req, res, next) => {
  try {
    const findID = await userSchema.findOne({_id: req.params.ID});
    if(findID === null || findID === undefined) {
       return res.status(404).json({msg: 'found no user', err: true});
    } else {
        req.user = findID;
        next()
        return
    }
  } catch (error) {
    return res.status(404).json({msg: 'found no user', err: true});
  }
};
