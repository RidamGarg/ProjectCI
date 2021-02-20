const customPage = require('./helpers/page');
let Page;
beforeEach(async() => {
    Page = await customPage.buildPage() ;
    await Page.goto('http://localhost:3000/')
});
afterEach(async()=>{
  await Page.close();
})
test('when logged in,Can see blog create form',async function(){
    await Page.login();
    await Page.click('a.btn-floating');
    const label = await Page.getContentsOf('form label');
    expect(label).toEqual('Blog Title')
})
describe('When logged in',()=>{
  beforeEach(async()=>{
    await Page.login();
    await Page.click('a.btn-floating');
  })
  describe('using invalid inputs',()=>{
    beforeEach(async()=>{
    await Page.click('form button')
    })
    test('Submitting shows error',async()=>{
      const title = await Page.getContentsOf('.title .red-text');
      const content = await Page.getContentsOf('.content .red-text');
      expect(title).toEqual('You must provide a value');
      expect(content).toEqual('You must provide a value');
    })
  })
  describe('using valid inputs',()=>{
    beforeEach(async()=>{
      await Page.type('.title input','My Title');
      await Page.type('.content input','My Content');
      await Page.click('form button')
    })
    test('Submitting takes user to review screen',async()=>{
      const headText = await Page.getContentsOf('h5');
      expect(headText).toEqual('Please confirm your entries');
    })
    test('Submitting then saving add blog to blog page',async()=>{
      await Page.click('.green')
      await Page.waitForSelector('.card-content')
      const title = await Page.getContentsOf('.card-title');
      const content = await Page.getContentsOf('p');
      expect(title).toEqual('My Title');
      expect(content).toEqual('My Content');
    })
  })
})
describe('When user is not login',()=>{
  const actions = [
    {
      method:'post',
      path:'/api/blogs',
      data:{title:'My Title',content:'My Content'}
    },
    {
      method:'get',
      path:'/api/blogs'
    }
  ]
 test('Blog related actions are prohibited',async()=>{
   const results = await Page.execRequests(actions);
   for(let result of results){
     expect(result).toEqual({ error: 'You must log in!' })
   }
 })
})