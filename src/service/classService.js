const connection = require('../entity/connection.js')
// connection la mot object dung de connect
class ClassService {
    connect;
    constructor(){
        connection.connectToMySQL();
        this.connect = connection.getConnection()
    }

    findAll = () =>{
        return new Promise((resolve, reject)=>{
            this.connect.query('select * from class',(err,classes)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(classes)
                }
            })
        })
    }
}
module.exports = new ClassService()