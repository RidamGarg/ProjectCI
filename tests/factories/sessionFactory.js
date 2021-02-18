const buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');//by this we can make session.sig.session.sig verifies whether the cookie is temperered.
const keys = require('../../config/keys');//by sessionString and cookieKey we able to generate session.sig
const keygrip = new Keygrip([keys.cookieKey])
module.exports = (user)=>{
const sessionObject = {
  passport:{
    user:user._id.toString() //As user._id is present in object form
  }
}//this return as a session from google o auth
//created fake session by taking user id from mongo db
const sessionString = buffer.from(JSON.stringify(sessionObject)).toString('base64');//taking sessionobject and converted to base64 which is same as return to us when we login.
//For backened process refer to Nodejs Advanced testing picture 140. 
const sessionSig = keygrip.sign('session='+sessionString);
return{
    sessionString,
    sessionSig
}
}