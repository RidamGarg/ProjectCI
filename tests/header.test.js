const customPage = require('./helpers/page')
//require('../middlewares/login')
let Page;
beforeEach(async() => {
    Page = await customPage.buildPage() ;
    await Page.goto('http://localhost:3000')
});
afterEach(async()=>{
  await Page.close();
})
// test('adds 1 + 2 to equal 3', () => {
// const sum = 3;
// expect(3).toEqual(3);
// });
test('the header has the correct text',async()=>{
const text = await Page.getContentsOf('a.brand-logo');//innerHtml also return only text but it can set html.
//the page.func()  in this func goes into chromium as string then it converted in function there and do some work there and then sends the response here in nodejs
expect(text).toEqual('Blogster');
})
test('clicking login starts oauth flows',async()=>{
await Page.click('.right a');
const url = await Page.url();
expect(url).toMatch('/accounts\.google\.com/');//same as accounts.google.com
})
//{"_id":{"$oid":"601331c4dbabb72eb83b7ff7"},"googleId":"114166704988303905592","displayName":"Ridam Garg","__v":{"$numberInt":"0"}}
test('getting logout button after login',async()=>{
  //For backened process refer to Nodejs Advanced testing picture 140.
  
  //page.login think about it.
await Page.login();
await Page.waitForSelector('a[href="/auth/logout"]')
//As all the await statement run concurrently the page.$eval will run before setcookie so we wait here until the 'a[href="/auth/logout"]' have some value.
//options <Object> Optional waiting parameters
//visible <boolean> wait for element to be present in DOM and to be visible. Defaults to false.Refer from google. 

const text = await Page.$eval('a[href="/auth/logout"]',el=>el.innerHTML);
expect(text).toEqual('Logout')
})