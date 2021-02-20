//With the help of proxy
const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory')
const userFactory = require('../factories/userFactory')
class customPage {
static async buildPage(){
const browser = await puppeteer.launch({
        headless:true, //by making it false gui will also work.gui help to show content on the screen like image,text.user can interact with the page.
        args:['--no-sandbox']//decrease the amount of time for tests.
      });
const page = await browser.newPage();
const custom = new customPage(page);
const fullPage = new Proxy(custom,{
get:function(target,property){
        return target[property]||browser[property]||page[property]//browser is first because there is clash of close function b/w page and browser.
    }
})
    return fullPage ;
}
constructor(page){
  this.page=page;
}
async getContentsOf(selector){
  return this.page.$eval(selector,el=>el.innerHTML);
}
  async login(){
  const user = await userFactory();
  const {sessionString,sessionSig} = sessionFactory(user);
  await this.page.setCookie( {
  name: 'session',
  value: sessionString
  })
  await this.page.setCookie( {
    name: 'session.sig',
    value: sessionSig
  })
  await this.page.goto('https://localhost:3000/blogs') //it is necessary so that all the code and page render(perform something) again
    }
  async get(path){
    return this.page.evaluate((_path)=>{
      return fetch(_path,{
        method:'GET',
        credentials:'same-origin',//By setting credentials:'same-origin' fetch includes cookie when sending request.As our all authentication is including cookie.
        headers:{
          'Content-Type':'application/json',
        }
      }).then(res=>res.json()) //in fetch res.json returns javascript object.
    },path)
  }
  async post(path,data){
    return this.page.evaluate((_path,_data)=>{ //first arg will be consider path any name can be given to this argument.
      return fetch(_path,{
        method:'POST',
        credentials:'same-origin',//By setting credentials:'same-origin' fetch includes cookie when sending request.As our all authentication is including cookie.
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(_data)
      }).then(res=>res.json()) //in fetch res.json returns javascript object.
    },path,data)
  }
  async execRequests(actions){
   return Promise.all(actions.map(({method,path,data})=>{ //combine all the promises.
     return this[method](path,data);
   }))
  }
}

module.exports = customPage;