const connection = require('../entity/connection.js')
// connection la mot object dung de connect
class StudentService {
    connect;
    constructor(){
        connection.connectToMySQL();
        this.connect = connection.getConnection()
    }
    findById = (id)=>{
        return new Promise((resolve, reject)=>{
            this.connect.query(`select student.*, class.class_name from student inner join class on student.class_id = class.class_id where student.id = ${id}`,(err,students)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(students[0])
                }
            })
        })
    }

    findAll = () =>{
        return new Promise((resolve, reject)=>{
            this.connect.query('select student.*, class.class_name from student inner join class on student.id = class.class_id',(err,students)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(students)
                }
            })
        })
    }

    set = (id, editStudent) =>{
        return new Promise((resolve, reject)=>{
            this.connect.query(`update student set name = '${editStudent.name}',class_id = '${editStudent.class_id}',  practical_grade = '${editStudent.practical_grade}', theory_grade = '${editStudent.theory_grade}',evaluate = '${editStudent.evaluate}', description = '${editStudent.description}' where student.id = ${id}`,(err,students)=>{
                if(err){
                    reject(err)
                }else{
                    resolve('set success')
                }
            })
        })
    }
    deleteById = (id) =>{
        return new Promise((resolve, reject)=>{
            this.connect.query(`delete from student where id = ${id}`,(err,student)=>{
                if(err){
                    reject(err)
                }else{
                    resolve('delete success')
                }
            })
        })
    }
    addStudentSql = (addStudent) =>{
        return new Promise((resolve, reject)=>{
            this.connect.query(`insert into student(name, class_id, practical_grade, theory_grade, evaluate, description) values('${addStudent.name}','${addStudent.class_id}','${addStudent.practical_grade}','${addStudent.theory_grade}','${addStudent.evaluate}', '${addStudent.description}')`,(err,students)=>{
                if(err){
                    reject(err)
                }else{
                    resolve('Add success')
                }
            })
        })
    }
}
module.exports = new StudentService()