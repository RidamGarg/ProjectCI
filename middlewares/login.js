const Page = require('puppeteer/lib/esm/puppeteer/common/Page');
const sessionFactory = require('./sessionFactory')
const userFactory = require('./userFactory')
Page.prototype.login = async function(){
const user = await userFactory();
const {sessionString,sessionSig} = sessionFactory(user);
await this.setCookie( {
name: 'session',
value: sessionString
})
await this.setCookie( {
  name: 'session.sig',
  value: sessionSig
})
await this.goto('http://localhost:3000/') 
}