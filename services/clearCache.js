const {clearHash} = require('../middlewares/cache');
module.exports = async (req,res,next)=>{
    await next();
    clearHash(req.user.id)
}