const connection = require('../entity/connection.js')
// connection la mot object dung de connect
class CategoryService{
    connect;
    constructor(){
        connection.connectToMySQL();
        this.connect = connection.getConnection()
    }

    findAll = () =>{
        return new Promise((resolve, reject)=>{
            this.connect.query('select * from category',(err,categories)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(categories)
                }
            })
        })
    }
}
module.exports = new CategoryService()