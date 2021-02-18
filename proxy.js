const { getVersion } = require("jest");

//proxy is used to combine more than 2 classes without changing any code in this two classes.
class Page{
  goto(){
    return 'I am going to another Page'
  }
  setCookie(){
    return 'I am setting a cookie'
  }
}
//1st method
// class customPage extends Page{
//   login(){
//     return this.goto() ;
//   }
// }
// console.log(cp.goto());
//2nd method
    //class customPage{
    //constructor(page){
    //      this.page = page
    //  }
    //   login(){
    //     return this.page.goto() ;
    //   }
    // }
// const cp = new customPage
// console.log(cp.login());
//// console.log(cp.page.goto());
//3rd method
class customPage{
  static build(){
      //combining two classes here
const page = new Page();
const custom = new customPage();
const fullPage = new Proxy(custom,{
  get:function(target,property){
    return target[property]||page[property]
  }
})
return fullPage ;
  }
 login(){
    return this.goto()+' '+this.setCookie();
  }
}
const fullPage = customPage.build();//in static function we do not need instance of class
console.log(fullPage.login());

const fn = ()=>{ return fetch('/api/blogs',{
  method:'POST',
  credentials:'same-origin',
  headers:{
    'Content-Type':'application/json',
  },
  body:JSON.stringify({title:'My Title',content:'My Content'})
}).then(res=>res.json()) //in fetch res.json returns javascript object.
.catch(err=>err);
}
async function getData(){
  const res = await fn();
  console.log(res);
}
