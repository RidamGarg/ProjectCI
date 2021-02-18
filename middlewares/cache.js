const mongoose = require('mongoose');
const exec = mongoose.Query.prototype.exec ;
const redis = require('redis');
const keys = require('../config/keys');
const client = redis.createClient(keys.redisUrl);
const util = require('util');
client.hget = util.promisify(client.hget);//returns promise as util.get is a callback function.
mongoose.Query.prototype.cache = function(options = {}){
    this.useCache = true ;
    this.hashKey = JSON.stringify(options.key||'');
    return this ; //to run futher functions return this.
}
mongoose.Query.prototype.exec = async function(){
    if(!this.useCache){
        const result = await exec.apply(this,arguments);
        return result 
    }
   const key = JSON.stringify(Object.assign({},this.getQuery(),{
       collection:this.mongooseCollection.name
   }))
   const cachedResult = await client.hget(this.hashKey,key);
    if(cachedResult){
   //console.log('In cache')
    const doc = JSON.parse(cachedResult);
     return  Array.isArray(doc)
     ?doc.map(d=>new this.model(d))
     :new this.model(doc);  //we have to return result which have mongoose function in it.
    }
    //console.log('Mongodb')
    const result = await exec.apply(this,arguments);
    client.hset(this.hashKey,key,JSON.stringify(result));
    client.expire(this.hashKey,86400);
    return result 
}
module.exports = {
     clearHash(hashKey){
         client.del(JSON.stringify(hashKey))
     }
}