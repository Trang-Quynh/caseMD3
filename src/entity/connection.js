const mysql = require('mysql')
class Connection{
    configToMySQL = {
        host: 'localhost',
        user: 'root',
        password: 'trang',
        database: 'student_manager',
        charset: 'utf8_general_ci'
    }
    getConnection = () =>{
        return mysql.createConnection(this.configToMySQL)
    }
    connectToMySQL = () => {
        this.getConnection().connect((err)=>{
            if(err){
                console.log(err)
            }
            console.log('Connect success')
        })
    }
}

module.exports = new Connection()