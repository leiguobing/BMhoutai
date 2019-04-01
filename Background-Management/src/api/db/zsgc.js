/**
 * 关于数据库的所有操作
 * 增
 * 删
 * 改
 * 查
 */

const mongodb = require('mongodb');
//获取Mongo客户端
const MongoClient = mongodb.MongoClient;

// 连接数据库
function connect(collectionName){
    return new Promise((resolve,reject)=>{
        MongoClient.connect('mongodb://localhost:27017',{useNewUrlParser: true},(err,client)=>{
            if(err){
                reject(err);
                return;
            }
            //使用数据库
            let db = client.db('h5_1811');
            //使用集合
            let col = db.collection(collectionName);
            resolve({col,client});
        });
    });
}

/**
 * 查：
 *  参数：
 *      collectionName：数据库集合名
 *      con：条件
 *          {
 *              qty：数量,
 *              page：页码
 *          }
 *      query：查找内容
 *  返回：
 *      code: 0（成功）/1（失败）,
 *      msg：信息,
 *      count：数据总数,
 *      data：查询结果[{},{}]
 */
exports.find = (collectionName,con,query)=>{
    return new Promise(async (resolve,reject)=>{
        let {col,client} = await connect(collectionName);
        // let {qty,page} = con;
        let qty = con.qty ? con.qty : 10;
        let page = con.page ? con.page : 1;
        qty *= 1;
        let num = qty*(page-1);
        let count = 0;
        //查询总条数
        col.find().toArray((err,result)=>{
            count = result.length;
        })
        //查询所有
        col.find(query).skip(num).limit(qty).toArray((err,result)=>{
            if(err){
                reject({
                    code:1,
                    msg:'fail',
                    count,
                    data:[]
                })
            }else{
                resolve({
                    code:0,
                    msg:'ok',
                    count,
                    data:result
                })
            }
        })
        client.close();
    });
}

/**
 * 增：
 *  参数：
 *      collectionName：数据库集合名
 *      data：插入数据的内容
 *          {
 *              phone：手机号,
 *              password：密码,
 *              ...
 *          }
 *  返回：
 *      code: 0（成功）/1（失败）,
 *      msg：信息,
 *      data：返回结果
 */
exports.insert = (collectionName,data)=>{
    return new Promise(async (resolve,reject)=>{
        let {col,client} = await connect(collectionName);

        // 插入数据
        col.insertOne(data,(err,result)=>{
            if(err){
                reject({
                    code:1,
                    msg:'fail',
                    data:err
                });
            }else{
                resolve({
                    code:0,
                    msg:'success',
                    data:result
                });
            }
            //关闭数据库，避免资源浪费
            client.close();
        })
    })
}

/**
 * 删：
 *  参数：
 *      collectionName：数据库集合名
 *      data：要删除的数据
 *          {
 *              _id：数据_id
 *          }
 *          或
 *          {
 *              _id:
 *                  {
 *                      $in:[]
 *                  }
 *          }
 *  返回：
 *      code: 0（成功）/1（失败）,
 *      msg：信息,
 *      data：返回删除条数
 */
exports.delete = (collectionName,query)=>{
    return new Promise(async(resolve,reject)=>{
        let {col,client} = await connect(collectionName);
        
        console.log(query);
        // 删除数据
        col.deleteMany({_id:{$in:query}},(err,result)=>{
            if(err){
                reject({
                    code:1,
                    msg:'fail',
                    data:err
                });
            }else{
                resolve({
                    code:0,
                    msg:'success',
                    data:result.deletedCount
                });
            }

            // 关闭数据库，避免资源浪费
            client.close();
        });
    
    });
}

/**
 * 改：
 *  参数：
 *      collectionName：数据库集合名
 *      query:{_id:数据id}
 *      data：修改数据的内容
 *          {
 *              phone：手机号,
 *              password：密码,
 *              ...
 *          }
 *  返回：
 *      code: 0（成功）/1（失败）,
 *      msg：信息,
 *      data：返回结果
 */
exports.update = (collectionName,query,data)=>{
    return new Promise(async (resolve,reject)=>{
        let {col,client} = await connect(collectionName);
        delete data._id;
        // 修改数据
        col.updateOne(query,{$set:data},(err,result)=>{
            if(err){
                reject({
                    code:1,
                    msg:'fail',
                    data:err
                });
            }else{
                resolve({
                    code:0,
                    msg:'success',
                    data:result
                });
            }
            //关闭数据库，避免资源浪费
            client.close();
        })
    })
}